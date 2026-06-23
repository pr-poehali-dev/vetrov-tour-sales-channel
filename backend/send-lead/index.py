import json
import os
import smtplib
import urllib.request
import urllib.parse
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


SMTP_HOST = 'smtp.yandex.ru'
SMTP_PORT = 465
EMAIL_FROM = 'EKVveter@yandex.ru'
EMAIL_TO = 'EKVveter@yandex.ru'


def send_email(name: str, contact: str, destination: str):
    password = os.environ.get('SMTP_PASSWORD', '')
    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка с сайта — {name}'
    msg['From'] = EMAIL_FROM
    msg['To'] = EMAIL_TO

    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;background:#f8f6f1;padding:32px;border-radius:16px;">
      <h2 style="color:#1a3d2e;margin:0 0 24px;">🌍 Новая заявка — Попутный ветер</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:10px 0;color:#666;width:140px;">👤 Имя</td><td style="padding:10px 0;font-weight:bold;color:#1a3d2e;">{name}</td></tr>
        <tr><td style="padding:10px 0;color:#666;">📞 Контакт</td><td style="padding:10px 0;font-weight:bold;color:#1a3d2e;">{contact}</td></tr>
        <tr><td style="padding:10px 0;color:#666;">📍 Направление</td><td style="padding:10px 0;font-weight:bold;color:#1a3d2e;">{destination or 'не указано'}</td></tr>
      </table>
      <p style="margin:24px 0 0;color:#999;font-size:13px;">Заявка получена с сайта vetrov.ru</p>
    </div>
    """
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
        server.login(EMAIL_FROM, password)
        server.sendmail(EMAIL_FROM, EMAIL_TO, msg.as_string())


def send_telegram(name: str, contact: str, destination: str):
    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')
    if not token or not chat_id:
        return
    text = (
        '🌍 Новая заявка с сайта «Попутный ветер»\n\n'
        f'👤 Имя: {name}\n'
        f'📞 Контакт: {contact}\n'
        f'📍 Направление: {destination or "не указано"}'
    )
    tg_url = f'https://api.telegram.org/bot{token}/sendMessage'
    payload = urllib.parse.urlencode({'chat_id': chat_id, 'text': text}).encode()
    req = urllib.request.Request(tg_url, data=payload, method='POST')
    with urllib.request.urlopen(req, timeout=10) as resp:
        resp.read()


def handler(event: dict, context) -> dict:
    '''
    Принимает заявку с формы сайта и отправляет её на почту EKVveter@yandex.ru и в Telegram.
    Args: event с httpMethod, body (name, contact, destination)
    Returns: HTTP-ответ с результатом отправки
    '''
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    if event.get('httpMethod') != 'POST':
        return {'statusCode': 405, 'headers': {**cors_headers, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'Method not allowed'})}

    body_data = json.loads(event.get('body') or '{}')
    name = (body_data.get('name') or '').strip()
    contact = (body_data.get('contact') or '').strip()
    destination = (body_data.get('destination') or '').strip()

    if not name or not contact:
        return {'statusCode': 400, 'headers': {**cors_headers, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': 'Укажите имя и контакт'})}

    send_email(name, contact, destination)
    send_telegram(name, contact, destination)

    return {'statusCode': 200, 'headers': {**cors_headers, 'Content-Type': 'application/json'}, 'body': json.dumps({'success': True})}
