import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const LEAD_URL = 'https://functions.poehali.dev/df9ca0cf-5996-4085-b38f-23b8ebcbbc1e';

const ALTAI = 'https://cdn.poehali.dev/projects/4b746671-1144-4abe-8cff-8534c097b550/files/c1c09e28-b810-4732-95a8-5d215e8bfc6a.jpg';
const KAMCHATKA = 'https://cdn.poehali.dev/projects/4b746671-1144-4abe-8cff-8534c097b550/files/5c1d1673-561b-433b-8360-4dc6da55620a.jpg';
const BAIKAL = 'https://cdn.poehali.dev/projects/4b746671-1144-4abe-8cff-8534c097b550/files/4c30e08b-9132-476c-9631-b17ffcad30db.jpg';

const REGIONS = ['Все', 'Алтай', 'Камчатка', 'Сибирь'];

const TOURS = [
  { title: 'Сердце Алтая', region: 'Алтай', img: ALTAI, days: 8, price: '74 900', date: '12 июля', tag: 'Хит сезона' },
  { title: 'Вулканы Камчатки', region: 'Камчатка', img: KAMCHATKA, days: 10, price: '128 500', date: '5 августа', tag: 'Экспедиция' },
  { title: 'Лёд Байкала', region: 'Сибирь', img: BAIKAL, days: 6, price: '58 200', date: '20 февраля', tag: 'Зимний' },
];

const REVIEWS = [
  { name: 'Анна Соколова', city: 'Москва', text: 'Алтай перевернул моё представление о путешествиях. Гид знал каждую тропу, а виды — космос!', tour: 'Сердце Алтая' },
  { name: 'Дмитрий Орлов', city: 'Санкт-Петербург', text: 'Камчатка — это другая планета. Организация на высоте, всё чётко и без суеты. Спасибо команде!', tour: 'Вулканы Камчатки' },
  { name: 'Мария Лебедева', city: 'Казань', text: 'Байкальский лёд — самое красивое, что я видела в жизни. Поеду снова и приведу друзей.', tour: 'Лёд Байкала' },
];

const FAQ = [
  { q: 'Что входит в стоимость тура?', a: 'Проживание, питание по программе, работа гида, трансферы по маршруту и все активности. Перелёт до точки старта оплачивается отдельно.' },
  { q: 'Нужна ли специальная подготовка?', a: 'Большинство маршрутов подходят для новичков с обычной физической формой. Для экспедиций уровень указан в описании тура.' },
  { q: 'Как происходит бронирование?', a: 'Вы оставляете заявку, мы связываемся с вами, согласуем детали и фиксируем место предоплатой 30%.' },
  { q: 'Можно ли вернуть деньги?', a: 'Да, условия возврата зависят от срока до старта тура. Подробности — в договоре, всё прозрачно.' },
];

export default function Index() {
  const [activeRegion, setActiveRegion] = useState('Все');
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', contact: '', destination: '' });
  const [sending, setSending] = useState(false);

  const filtered = activeRegion === 'Все' ? TOURS : TOURS.filter((t) => t.region === activeRegion);

  const submitLead = async () => {
    if (!form.name.trim() || !form.contact.trim()) {
      toast({ title: 'Заполните имя и контакт', variant: 'destructive' });
      return;
    }
    setSending(true);
    try {
      const res = await fetch(LEAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Заявка отправлена!', description: 'Мы свяжемся с вами в течение часа.' });
      setForm({ name: '', contact: '', destination: '' });
    } catch {
      toast({ title: 'Не удалось отправить', description: 'Попробуйте позже или позвоните нам.', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  const nav = [
    ['Туры', 'tours'],
    ['Отзывы', 'reviews'],
    ['О нас', 'about'],
    ['Вопросы', 'faq'],
    ['Контакты', 'contacts'],
  ];

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen overflow-x-hidden noise">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2 glass rounded-full pl-4 pr-5 py-2 shadow-lg">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <Icon name="Wind" size={18} className="text-secondary" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-sm">Попутный ветер</div>
              <div className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Vetrov</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-1 glass rounded-full px-2 py-2 shadow-lg">
            {nav.map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="px-4 py-2 rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {label}
              </button>
            ))}
          </nav>
          <Button
            onClick={() => scrollTo('contacts')}
            className="rounded-full bg-secondary hover:bg-secondary/90 shadow-lg"
          >
            Личный кабинет
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center perspective">
        <div className="absolute inset-0">
          <img src={ALTAI} alt="Алтай" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/30 to-background" />
        </div>

        <div className="container relative pt-32 pb-20">
          <div className="max-w-3xl animate-fade-in">
            <span className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm font-medium text-primary mb-6">
              <Icon name="Sparkles" size={16} className="text-secondary" />
              Авторские туры по России с 2014 года
            </span>
            <h1 className="font-display font-black text-white text-5xl md:text-7xl leading-[0.95] text-balance drop-shadow-2xl">
              Поймай свой
              <span className="block bg-gradient-to-r from-secondary via-orange-300 to-secondary bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-shift">
                попутный ветер
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-white/90 max-w-xl">
              Алтай, Камчатка, Байкал и другие дикие края. Маленькие группы, проверенные гиды и маршруты, которые меняют людей.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                onClick={() => scrollTo('tours')}
                size="lg"
                className="rounded-full bg-secondary hover:bg-secondary/90 text-base h-14 px-8 shadow-xl"
              >
                Выбрать тур
                <Icon name="ArrowRight" size={20} className="ml-1" />
              </Button>
              <Button
                onClick={() => scrollTo('about')}
                size="lg"
                variant="outline"
                className="rounded-full h-14 px-8 text-base glass border-white/40 text-white hover:bg-white/20"
              >
                <Icon name="Play" size={18} className="mr-1" />
                О компании
              </Button>
            </div>

            <div className="mt-14 flex gap-8">
              {[['12 000+', 'путешественников'], ['48', 'маршрутов'], ['4.9', 'рейтинг']].map(([n, l]) => (
                <div key={l}>
                  <div className="font-display font-bold text-3xl text-white">{n}</div>
                  <div className="text-sm text-white/70">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TOURS */}
      <section id="tours" className="py-24 relative">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-secondary font-semibold tracking-widest uppercase text-sm">Каталог</span>
              <h2 className="font-display font-bold text-4xl md:text-5xl mt-2">Выбери приключение</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveRegion(r)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    activeRegion === r
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-muted text-muted-foreground hover:bg-muted/70'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 perspective">
            {filtered.map((t) => (
              <article key={t.title} className="tilt-card group rounded-3xl overflow-hidden bg-card shadow-xl">
                <div className="relative h-72 overflow-hidden">
                  <img src={t.img} alt={t.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-4 left-4 glass rounded-full px-3 py-1.5 text-xs font-semibold text-primary">
                    {t.tag}
                  </span>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                    <span className="flex items-center gap-1.5 text-sm">
                      <Icon name="MapPin" size={16} /> {t.region}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm">
                      <Icon name="Calendar" size={16} /> {t.date}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display font-bold text-2xl">{t.title}</h3>
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Icon name="Clock" size={16} /> {t.days} дней</span>
                    <span className="flex items-center gap-1.5"><Icon name="Users" size={16} /> до 12 чел.</span>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-muted-foreground">от</span>
                      <div className="font-display font-bold text-2xl">{t.price} ₽</div>
                    </div>
                    <Button className="rounded-full bg-secondary hover:bg-secondary/90">Подробнее</Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl animate-float" />
        <div className="container relative grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-secondary font-semibold tracking-widest uppercase text-sm">О компании</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl mt-3 mb-6">
              Мы влюбляем людей в Россию
            </h2>
            <p className="text-primary-foreground/80 text-lg leading-relaxed">
              «Попутный ветер» начался в 2014 году с одного рюкзака и мечты показать друзьям настоящий Алтай. Сегодня мы — команда из 20 гидов, которые знают дикие тропы как свои пять пальцев.
            </p>
            <div className="grid grid-cols-2 gap-6 mt-10">
              {[
                ['Shield', 'Безопасность', 'Сертифицированные гиды и страховка'],
                ['Heart', 'Душевно', 'Маленькие группы до 12 человек'],
                ['Leaf', 'Экологично', 'Бережём природу, которую любим'],
                ['Award', 'Опыт', '11 лет в авторских путешествиях'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="glass rounded-2xl p-5 text-primary">
                  <Icon name={icon} size={24} className="text-secondary mb-2" />
                  <div className="font-display font-bold">{title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative perspective">
            <div className="tilt-card rounded-3xl overflow-hidden shadow-2xl">
              <img src={KAMCHATKA} alt="Камчатка" className="w-full h-[520px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-secondary font-semibold tracking-widest uppercase text-sm">Галерея</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl mt-2">Маршруты в кадре</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
            {[
              [ALTAI, 'row-span-2 col-span-2'],
              [KAMCHATKA, ''],
              [BAIKAL, ''],
              [BAIKAL, ''],
              [ALTAI, ''],
            ].map(([img, span], i) => (
              <div key={i} className={`relative rounded-3xl overflow-hidden group ${span}`}>
                <img src={img} alt="Маршрут" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Icon name="Maximize2" size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-secondary font-semibold tracking-widest uppercase text-sm">Отзывы</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl mt-2">Им есть что рассказать</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {REVIEWS.map((r) => (
              <div key={r.name} className="bg-card rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow">
                <div className="flex gap-1 text-secondary mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="Star" size={18} className="fill-secondary" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed">«{r.text}»</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-display font-bold">
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-sm text-muted-foreground">{r.city} · {r.tour}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <span className="text-secondary font-semibold tracking-widest uppercase text-sm">FAQ</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl mt-2">Частые вопросы</h2>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="bg-card rounded-2xl px-6 border shadow-sm">
                <AccordionTrigger className="text-left font-display font-semibold text-lg hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl animate-float" />
        <div className="container relative grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">Готовы в путь?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Оставьте контакты — подберём тур под вашу мечту и бюджет. Ответим в течение часа.
            </p>
            <div className="space-y-4">
              {[
                ['Phone', '+7 (981) 827-13-53', 'tel:+79818271353'],
                ['Mail', 'hello@vetrov.ru', 'mailto:hello@vetrov.ru'],
                ['Send', 'Telegram: @vetrov_tours', 'https://t.me/vetrov_tours'],
              ].map(([icon, text, href]) => (
                <a key={text} href={href} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-11 h-11 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Icon name={icon} size={20} className="text-secondary" />
                  </div>
                  <span className="text-lg">{text}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="glass rounded-3xl p-8 text-primary shadow-2xl">
            <h3 className="font-display font-bold text-xl mb-5">Оставить заявку</h3>
            <div className="space-y-4">
              <Input
                placeholder="Ваше имя"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-12 rounded-xl bg-white"
              />
              <Input
                placeholder="Телефон или Telegram"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                className="h-12 rounded-xl bg-white"
              />
              <Input
                placeholder="Куда хотите поехать?"
                value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })}
                className="h-12 rounded-xl bg-white"
              />
              <Button
                onClick={submitLead}
                disabled={sending}
                className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-base"
              >
                {sending ? 'Отправляем...' : 'Отправить заявку'}
                <Icon name="Send" size={18} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-background py-12">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Icon name="Wind" size={20} className="text-secondary" />
            <span className="font-display font-bold">Попутный ветер · Vetrov</span>
          </div>
          <p className="text-sm text-background/60">© 2026 Все права защищены. Сделано с любовью к России.</p>
        </div>
      </footer>
    </div>
  );
}