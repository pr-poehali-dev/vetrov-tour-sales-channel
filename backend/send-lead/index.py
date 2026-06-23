import json
import os
import urllib.request
import urllib.parse


def handler(event: dict, context) -> dict:
    '''
    Принимает заявку с формы сайта и отправляет её в Telegram владельцу.
    Args: event с httpMethod, body (name, contact, destination); context с request_id
    Returns: HTTP-ответ с результатом отправки
    '''
    method = event.get('httpMethod', 'GET')

    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
    }

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    body_data = json.loads(event.get('body') or '{}')
    name = (body_data.get('name') or '').strip()
    contact = (body_data.get('contact') or '').strip()
    destination = (body_data.get('destination') or '').strip()

    if not name or not contact:
        return {
            'statusCode': 400,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Укажите имя и контакт'}),
        }

    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    chat_id = os.environ.get('TELEGRAM_CHAT_ID')

    if not token or not chat_id:
        return {
            'statusCode': 500,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Telegram не настроен'}),
        }

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

    return {
        'statusCode': 200,
        'headers': {**cors_headers, 'Content-Type': 'application/json'},
        'body': json.dumps({'success': True}),
    }
