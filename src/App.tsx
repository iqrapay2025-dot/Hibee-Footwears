import { useState, useEffect, useRef } from 'react'
import hibeeLogo from './assets/hibee-logo.png'

/* ── Types ───────────────────────────────────────────────────── */

type Category = 'shoes' | 'sandals' | 'palm-slippers'
type Filter = 'all' | Category

interface Product {
  id: number
  name: string
  category: Category
  price: number
  imgSrc: string
  description: string
}

interface CartItem extends Product {
  qty: number
}

/* ── Instagram product image URLs ────────────────────────────── */

const I = {
  tassel_loafer_black: 'https://scontent-ham3-1.cdninstagram.com/v/t51.82787-15/652085077_18093772364025859_7610916903499907554_n.webp?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=103&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=35yLnBgOZbsQ7kNvwEDFEr5&_nc_oc=AdrpEDdM2Xap-ASOXvMgWLl5ascQUnduv7GuZyqP_DgDNGA2XU5q7dmG1yMw3ZjM6Io&_nc_zt=23&_nc_ht=scontent-ham3-1.cdninstagram.com&_nc_gid=vTyXE18-kMhGLLnFfrzcXw&_nc_ss=79689&oh=00_AQKCG7fRx2pEktYh6D9wEzAYnriAkWDCgTIsCySEYMmxzQ&oe=6ABC639A',
  navy_boat_shoe:      'https://scontent-ham3-1.cdninstagram.com/v/t51.82787-15/671788508_18583557241061773_3651856216831880009_n.webp?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=105&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=Ycw7dfHqUfIQ7kNvwH71bFp&_nc_oc=Adp5jVjMVszDX9SNccTeE91WYvuQmHGoBrqpCP7zM4EO7gbwBnYik4ozkKWjoEwcTig&_nc_zt=23&_nc_ht=scontent-ham3-1.cdninstagram.com&_nc_gid=vTyXE18-kMhGLLnFfrzcXw&_nc_ss=79689&oh=00_AQJE5ocz5MwR1oNyCVySZTLAxcTF7pZCEQ3zX6n5wkhEFQ&oe=6ABC6C02',
  woven_palm:          'https://scontent-ham3-1.cdninstagram.com/v/t51.82787-15/653734007_18044686235737834_5227746159770556832_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=100&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=PZ4i8C5osKwQ7kNvwHZb_TR&_nc_oc=AdoJHcqSVJmXcvHGYrJ8tH_DzbqH1L_cICfdjjnK7F0PbV_W0PEFBqtAsaTz6ykMMPM&_nc_zt=23&_nc_ht=scontent-ham3-1.cdninstagram.com&_nc_gid=vTyXE18-kMhGLLnFfrzcXw&_nc_ss=79689&oh=00_AQJ4A3nKTYhIEogpMdjfCVXenOMGFZzuNao-yllJcLs2Tg&oe=6ABC8181',
  burgundy_suede:      'https://scontent-ham3-1.cdninstagram.com/v/t39.30808-6/358686671_18374249236045556_8419520269274756603_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=105&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=vAcpMrizDRsQ7kNvwE3TCxd&_nc_oc=Ado9Qx00VeNUjGVF4c252Ny9LgKjKNvR76YjljYL-YoU6gmYuibHjga8GoYZyS05deU&_nc_zt=23&_nc_ht=scontent-ham3-1.cdninstagram.com&_nc_gid=vTyXE18-kMhGLLnFfrzcXw&_nc_ss=79689&oh=00_AQJtUgPKp-uyUGzBzzBiLhjLL7cfPkefFyanKffLFF-04A&oe=6ABC65E9',
  taupe_slingback:     'https://scontent-ham3-1.cdninstagram.com/v/t51.82787-15/576099102_18543802138045556_1405105834955330173_n.heic?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=103&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0FST1VTRUxfSVRFTS5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=5n_HhRrGo-cQ7kNvwHaU23s&_nc_oc=AdqoUJHBBAJZoRmUpYkjV5bIIb6XukoCQ-t0s6FTcn8oj6WXUkHHziI_h49GyVbsQI8&_nc_zt=23&_nc_ht=scontent-ham3-1.cdninstagram.com&_nc_gid=vTyXE18-kMhGLLnFfrzcXw&_nc_ss=79689&oh=00_AQJDGb4NAsZEICORFp4GkvDzSs8xJeGdBrgMJQByTEDE8Q&oe=6ABC6EFC',
  brogue_tassel:       'https://scontent-ham3-1.cdninstagram.com/v/t51.71878-15/572664722_1387943412718751_1953806505616161280_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=104&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=2LdXQjqCUaAQ7kNvwFRsCyd&_nc_oc=AdpxjyU8wZSDn0Jgwzk20GMBFOZos1ma8nTPsTTH6WkcKu-24r_htQNbHqryhy-1G3Q&_nc_zt=23&_nc_ht=scontent-ham3-1.cdninstagram.com&_nc_gid=vTyXE18-kMhGLLnFfrzcXw&_nc_ss=79689&oh=00_AQJnat4RwQsw80xv4YgMfLroSBJCRpZdHelumkrne69_KA&oe=6ABC5D0C',
  leopard_slip_on:     'https://scontent-ham3-1.cdninstagram.com/v/t51.71878-15/499221205_1035276152041361_3689031202722976273_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=101&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=Kyzc1o7ZLfwQ7kNvwHiY52W&_nc_oc=AdrqNtoRza_l-rq-eBLp9nAqmX3Cg4NDB7AtKGKC4-qOrDwuV9EampSGVBgPacHB5kM&_nc_zt=23&_nc_ht=scontent-ham3-1.cdninstagram.com&_nc_gid=vTyXE18-kMhGLLnFfrzcXw&_nc_ss=79689&oh=00_AQLegTdxeijgghh60VO6gMQ42mN7SjR5Ym1pegUpmZbOvw&oe=6ABC6F52',
  triple_monk:         'https://scontent-ham3-1.cdninstagram.com/v/t51.71878-15/502460614_713099281195382_6928329531457951510_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=106&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=K3Y0oe1QMGIQ7kNvwHazujT&_nc_oc=Ado0Jq4m53cJoSdadhWRbQOYVRXvxiEhqRe1fwQigMm3eInHGtien-dOALW112va2bk&_nc_zt=23&_nc_ht=scontent-ham3-1.cdninstagram.com&_nc_gid=vTyXE18-kMhGLLnFfrzcXw&_nc_ss=79689&oh=00_AQILZ5sIeGg6bCblwv-zQGZfV2hPX4jthl4ZHyRaJA0s3Q&oe=6ABC798B',
  croc_horsebit:       'https://scontent-ham3-1.cdninstagram.com/v/t51.71878-15/501275115_1127103089178234_2539542150107243230_n.jpg?stp=dst-jpg_e35_s640x640_tt6&_nc_cat=105&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=uLK0KaoYlnQQ7kNvwG-PXp9&_nc_oc=Adr9ca2u7GfSV0jPBQR20GTFQPc4kz4pCKjLedcj_0BOZWEKKSi5sYuaRav57WeBfJE&_nc_zt=23&_nc_ht=scontent-ham3-1.cdninstagram.com&_nc_gid=vTyXE18-kMhGLLnFfrzcXw&_nc_ss=79689&oh=00_AQJqSakiyBJix4YwQpAicFyqfvw50VvSs5RnHlqru7ltdA&oe=6ABC78E0',
}

/* ── Constants & Data ────────────────────────────────────────── */

const WHATSAPP = '2348097444087'
const EMAIL = 'hibeefootwear@gmail.com'
const INSTAGRAM = 'hibeefootwear'
const FACEBOOK = 'hibeefootwear'
const RC = 'RC 2375499'

const HERO_SLIDES = [
  {
    imgSrc: I.tassel_loafer_black,
    headline: 'Handcrafted\nfor Your Feet',
    sub: 'Bespoke leather footwear, made to measure in Lagos.',
  },
  {
    imgSrc: I.brogue_tassel,
    headline: 'Genuine Leather,\nEvery Pair',
    sub: 'Cut and stitched to order — never off a shelf.',
  },
  {
    imgSrc: I.navy_boat_shoe,
    headline: 'Lagos-Made,\nWorldclass Finish',
    sub: 'Skilled artisans. Real leather. Delivered to your door.',
  },
  {
    imgSrc: I.triple_monk,
    headline: 'Your Story,\nYour Shoes',
    sub: 'Message us on WhatsApp and your pair is underway.',
  },
]

const PRODUCTS: Product[] = [
  // Shoes
  { id: 1, name: 'Tassel Loafer', category: 'shoes', price: 32000, imgSrc: I.tassel_loafer_black, description: 'Hand-sewn tassel loafer in dark navy with gold-toned lining' },
  { id: 2, name: 'Brogue Tassel Loafer', category: 'shoes', price: 28000, imgSrc: I.brogue_tassel, description: 'Cognac brogue-punched tassel loafer with purple interior' },
  { id: 3, name: 'Triple Monk Strap', category: 'shoes', price: 35000, imgSrc: I.triple_monk, description: 'Three-buckle monk strap in tan leather with cap-toe broguing' },
  // Sandals
  { id: 4, name: 'Navy Deck Shoe', category: 'sandals', price: 22000, imgSrc: I.navy_boat_shoe, description: 'Classic boat shoe in navy leather with white rope sole' },
  { id: 5, name: 'Burgundy Suede Slipper', category: 'sandals', price: 18000, imgSrc: I.burgundy_suede, description: 'Rich burgundy suede slip-on with tonal hand-finishing' },
  { id: 6, name: 'Buckle Slingback', category: 'sandals', price: 20000, imgSrc: I.taupe_slingback, description: 'Taupe suede slingback clog with antique brass buckle' },
  // Palm Slippers
  { id: 7, name: 'Woven Leather Palm', category: 'palm-slippers', price: 12000, imgSrc: I.woven_palm, description: 'Hand-woven cognac leather mule with monogram emblem' },
  { id: 8, name: 'Leopard Slip-On', category: 'palm-slippers', price: 14000, imgSrc: I.leopard_slip_on, description: 'Bold leopard-print slip-on with embroidered lion crest' },
  { id: 9, name: 'Croc Horsebit Mule', category: 'palm-slippers', price: 15000, imgSrc: I.croc_horsebit, description: 'Dark croc-embossed leather mule with gold horsebit hardware' },
]

/* ── Helpers ─────────────────────────────────────────────────── */

function fmt(n: number) {
  return `₦${n.toLocaleString('en-NG')}`
}

function buildWAUrl(cart: CartItem[]) {
  const lines = cart.map(i => `• ${i.name} × ${i.qty} — ${fmt(i.price * i.qty)}`).join('\n')
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const msg = [
    "Hello Hibeefootwear! I'd like to place a bespoke order:",
    '',
    lines,
    '',
    `Estimated total: ${fmt(total)}`,
    '',
    'Please confirm sizes, details, and final pricing. Thank you!',
  ].join('\n')
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`
}

function categoryLabel(c: Category) {
  if (c === 'palm-slippers') return 'Palm Slippers'
  return c.charAt(0).toUpperCase() + c.slice(1)
}

/* ── Hook: Scroll Reveal ─────────────────────────────────────── */

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

/* ── Icons ───────────────────────────────────────────────────── */

function IconCart({ cls = 'w-5 h-5' }: { cls?: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
  )
}

function IconWhatsApp({ cls = 'w-5 h-5' }: { cls?: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  )
}

function IconClose({ cls = 'w-5 h-5' }: { cls?: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}

function IconChevronUp({ cls = 'w-4 h-4' }: { cls?: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  )
}

function IconChevronLeft({ cls = 'w-5 h-5' }: { cls?: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  )
}

function IconChevronRight({ cls = 'w-5 h-5' }: { cls?: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  )
}

function IconInstagram({ cls = 'w-5 h-5' }: { cls?: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  )
}

function IconFacebook({ cls = 'w-5 h-5' }: { cls?: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function IconMail({ cls = 'w-5 h-5' }: { cls?: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

function IconPin({ cls = 'w-5 h-5' }: { cls?: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  )
}

function IconPhone({ cls = 'w-5 h-5' }: { cls?: string }) {
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.5 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012.41 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.37a16 16 0 006.72 6.72l.74-.74a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  )
}

/* ── Navbar ──────────────────────────────────────────────────── */

function Navbar({ cartCount, onCartOpen }: { cartCount: number; onCartOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { label: 'About', id: 'about' },
    { label: 'Process', id: 'process' },
    { label: 'Shop', id: 'shop' },
    { label: 'Contact', id: 'contact' },
  ]
  const [activeSection, setActiveSection] = useState('about')

  useEffect(() => {
    const sections = links
      .map(link => document.getElementById(link.id))
      .filter((section): section is HTMLElement => section instanceof HTMLElement)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visible?.target?.id) {
          setActiveSection(visible.target.id)
        }
      },
      { rootMargin: '-25% 0px -50% 0px', threshold: [0.2, 0.4, 0.6] }
    )

    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-tan/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5">
          <div
            className={`rounded-sm transition-all duration-300 overflow-hidden flex-shrink-0 ${
              scrolled ? 'bg-transparent p-0' : 'bg-white/90 backdrop-blur-sm p-1'
            }`}
          >
            <img
              src={hibeeLogo}
              alt="Hibeefootwear — Put It On"
              className="h-10 w-auto"
            />
          </div>
          <span className={`font-heading font-semibold text-lg tracking-tight transition-colors duration-300 ${scrolled ? 'text-espresso' : 'text-cream'}`}>
            Hibeefootwear
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map(link => {
            const isActive = activeSection === link.id

            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={isActive ? 'page' : undefined}
                className={`relative text-sm font-body font-medium transition-all duration-200 after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-left after:transition-transform after:duration-200 ${
                  isActive ? 'text-rust after:scale-x-100' : `after:scale-x-0 ${scrolled ? 'text-ink/65 hover:text-rust' : 'text-cream/80 hover:text-cream'}`
                }`}
              >
                {link.label}
              </a>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onCartOpen}
            aria-label="Open cart"
            className={`relative p-2 transition-colors duration-200 ${
              scrolled ? 'text-espresso hover:text-rust' : 'text-cream/90 hover:text-cream'
            }`}
          >
            <IconCart />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rust text-cream text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          <button
            className={`md:hidden p-2 flex flex-col gap-[5px] transition-colors ${scrolled ? 'text-espresso' : 'text-cream'}`}
            onClick={() => setMenuOpen(m => !m)}
            aria-label="Toggle navigation"
          >
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-64 border-b border-tan/20' : 'max-h-0'
        } bg-white/97 backdrop-blur-md`}
      >
        <div className="px-5 py-4 flex flex-col gap-4">
          {links.map(link => {
            const isActive = activeSection === link.id

            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative font-body font-medium text-base transition-all duration-200 after:absolute after:left-0 after:-bottom-1 after:h-px after:w-full after:origin-left after:transition-transform after:duration-200 ${
                  isActive ? 'text-rust after:scale-x-100' : 'text-ink/75 hover:text-rust after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                {link.label}
              </a>
            )
          })}
        </div>
      </div>
    </header>
  )
}

/* ── Hero ────────────────────────────────────────────────────── */

function HeroSection() {
  const [current, setCurrent] = useState(0)
  const count = HERO_SLIDES.length

  useEffect(() => {
    const id = setInterval(() => setCurrent(c => (c + 1) % count), 5500)
    return () => clearInterval(id)
  }, [count])

  return (
    <section id="top" className="relative h-screen min-h-[600px] overflow-hidden bg-espresso">
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={i !== current}
        >
          <img
            src={slide.imgSrc}
            alt=""
            className="w-full h-full object-cover object-center"
            loading={i === 0 ? 'eager' : 'lazy'}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/55 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
        </div>
      ))}

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-6xl mx-auto px-5 w-full">
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ease-out ${
                i === current ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none absolute'
              }`}
            >
              {i === current && (
                <>
                  {/* <p className="text-tan font-body text-xs font-semibold tracking-[0.2em] uppercase mb-5">
                    Bespoke · Handmade · Lagos · Est. 2014
                  </p> */}
                  <h1 className="font-heading text-cream text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] mb-6 whitespace-pre-line">
                    {slide.headline}
                  </h1>
                  <p className="text-cream/75 font-body text-lg max-w-md mb-8 leading-relaxed">
                    {slide.sub}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href="#shop"
                      className="inline-flex items-center gap-2 bg-rust text-cream font-body font-semibold text-sm px-7 py-3.5 hover:bg-espresso transition-colors duration-200"
                    >
                      Shop the Range
                    </a>
                    <a
                      href={`https://wa.me/${WHATSAPP}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-cream/40 text-cream font-body font-semibold text-sm px-7 py-3.5 hover:bg-cream/15 transition-colors duration-200 backdrop-blur-sm"
                    >
                      <IconWhatsApp cls="w-4 h-4" />
                      Order on WhatsApp
                    </a>
                  </div>
                  <p className="mt-7 text-cream/30 text-xs font-body tracking-wider">{RC}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        <button
          onClick={() => setCurrent(c => (c - 1 + count) % count)}
          className="p-2 text-cream/50 hover:text-cream transition-colors"
          aria-label="Previous slide"
        >
          <IconChevronLeft />
        </button>
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'w-7 h-2 bg-tan' : 'w-2 h-2 bg-cream/35 hover:bg-cream/60'
            }`}
          />
        ))}
        <button
          onClick={() => setCurrent(c => (c + 1) % count)}
          className="p-2 text-cream/50 hover:text-cream transition-colors"
          aria-label="Next slide"
        >
          <IconChevronRight />
        </button>
      </div>
    </section>
  )
}

/* ── About Card ──────────────────────────────────────────────── */

function AboutCard({
  icon, title, body, visible, delay,
}: {
  icon: string; title: string; body: string; visible: boolean; delay: number
}) {
  return (
    <div
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } bg-white border border-tan/20 p-8 group hover:border-tan/50 hover:shadow-lg`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-rust text-3xl mb-5 transition-transform duration-300 group-hover:scale-110 w-fit">
        {icon}
      </div>
      <h3 className="font-heading text-espresso text-xl font-semibold mb-3">{title}</h3>
      <p className="font-body text-ink/65 text-sm leading-relaxed">{body}</p>
    </div>
  )
}

/* ── About Section ───────────────────────────────────────────── */

function AboutSection() {
  const { ref, visible } = useScrollReveal()

  const cards = [
    {
      icon: '✦',
      title: 'Bespoke Only',
      body: "Every pair is made to your measurements. We don't hold stock — your shoes are cut and stitched the day you order.",
    },
    {
      icon: '◈',
      title: 'Genuine Leather',
      body: 'We source full-grain and top-grain hides so every pair ages beautifully and gets better with wear.',
    },
    {
      icon: '◉',
      title: 'Lagos-Made',
      body: 'Skilled artisans in Lagos, Nigeria craft each pair by hand. Est. 2014 — locally made, internationally finished.',
    },
  ]

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="stitch-divider mb-16" />

        <div
          ref={ref}
          className={`transition-all duration-700 ease-out mb-14 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-rust font-body text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            About Us
          </p>
          <h2 className="font-heading text-espresso text-4xl md:text-5xl font-semibold leading-tight max-w-lg">
            Made the old way.<br />Made for you.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <AboutCard key={i} {...card} visible={visible} delay={i * 130} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Process Section ─────────────────────────────────────────── */

function ProcessStep({
  step, title, body, visible, delay,
}: {
  step: string; title: string; body: string; visible: boolean; delay: number
}) {
  return (
    <div
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-5">
        <div className="flex-shrink-0 w-12 h-12 border border-rust/40 flex items-center justify-center">
          <span className="font-heading text-rust text-xl font-semibold">{step}</span>
        </div>
        <div>
          <h3 className="font-heading text-cream text-xl font-semibold mb-2">{title}</h3>
          <p className="font-body text-cream/60 text-sm leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  )
}

function ProcessSection() {
  const { ref, visible } = useScrollReveal()

  const steps = [
    { step: '01', title: 'Ask', body: 'Reach out on WhatsApp or Instagram. Tell us what you want — style, colour, sole, occasion.' },
    { step: '02', title: 'Confirm', body: "We confirm your size, foot measurements, leather type, and details. You approve the spec before we cut a single piece." },
    { step: '03', title: 'Handmade', body: 'Our Lagos artisans cut, stitch, and finish your pair by hand. Lead time is typically 7–14 days.' },
    { step: '04', title: 'Delivered', body: 'Your bespoke pair ships to your door anywhere in Nigeria. We follow up to ensure the fit is perfect.' },
  ]

  return (
    <section id="process" className="py-24 bg-espresso">
      <div className="max-w-6xl mx-auto px-5">
        <div className="mb-16">
          <p className="text-tan font-body text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            How It's Made
          </p>
          <h2 className="font-heading text-cream text-4xl md:text-5xl font-semibold leading-tight max-w-lg">
            From your message<br />to your door.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
          {steps.map((s, i) => (
            <ProcessStep key={i} {...s} visible={visible} delay={i * 120} />
          ))}
        </div>

        <div
          className={`transition-all duration-700 delay-500 ease-out mt-16 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="border-t border-tan/20 pt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="font-body text-cream/60 text-sm">Ready to order?</p>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-body font-semibold text-sm px-6 py-3 hover:bg-[#1fb85a] transition-colors duration-200"
            >
              <IconWhatsApp cls="w-4 h-4" />
              Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Product Card ────────────────────────────────────────────── */

function ProductCard({
  product, visible, delay, onAdd,
}: {
  product: Product; visible: boolean; delay: number; onAdd: (p: Product) => void
}) {
  return (
    <div
      className={`transition-all duration-700 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } group bg-white border border-tan/15 hover:border-tan/45 hover:shadow-xl overflow-hidden flex flex-col`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative overflow-hidden aspect-square bg-espresso/5">
        <img
          src={product.imgSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/8 transition-colors duration-300" />
        <div className="absolute top-3 left-3">
          <span className="bg-white text-rust text-[10px] font-body font-semibold tracking-widest uppercase px-2 py-1">
            {categoryLabel(product.category)}
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-heading text-espresso text-lg font-semibold mb-1">{product.name}</h3>
        <p className="font-body text-ink/60 text-sm leading-relaxed mb-4 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="font-heading text-espresso font-bold text-xl">{fmt(product.price)}</span>
            <span className="text-ink/40 text-xs font-body block">starting price</span>
          </div>
          <button
            onClick={() => onAdd(product)}
            className="text-sm font-body font-semibold text-cream bg-espresso px-4 py-2.5 hover:bg-rust transition-colors duration-200 flex-shrink-0"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Shop Section ────────────────────────────────────────────── */

function ShopSection({ onAddToCart }: { onAddToCart: (p: Product) => void }) {
  const { ref, visible } = useScrollReveal()
  const [filter, setFilter] = useState<Filter>('all')

  const filters: { label: string; value: Filter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Shoes', value: 'shoes' },
    { label: 'Sandals', value: 'sandals' },
    { label: 'Palm Slippers', value: 'palm-slippers' },
  ]

  const shown = PRODUCTS.filter(p => filter === 'all' || p.category === filter)

  return (
    <section id="shop" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="stitch-divider mb-16" />

        <div className="mb-10">
          <p className="text-rust font-body text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            The Range
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <h2 className="font-heading text-espresso text-4xl md:text-5xl font-semibold leading-tight">
              Shop the Collection
            </h2>
            <div className="flex flex-wrap gap-2">
              {filters.map(f => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`font-body text-sm font-medium px-4 py-2 border transition-colors duration-200 ${
                    filter === f.value
                      ? 'bg-espresso text-cream border-espresso'
                      : 'text-espresso border-tan/40 hover:border-espresso hover:bg-espresso/5'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              visible={visible}
              delay={i * 80}
              onAdd={onAddToCart}
            />
          ))}
        </div>

        <div
          className={`transition-all duration-700 delay-700 ease-out mt-12 text-center ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="font-body text-ink/50 text-sm mb-4">
            Prices shown are starting estimates. Final quote confirmed via WhatsApp — no payment taken online.
          </p>
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-rust font-body font-semibold text-sm hover:text-espresso transition-colors duration-200"
          >
            <IconWhatsApp cls="w-4 h-4" />
            Request a custom order →
          </a>
        </div>
      </div>
    </section>
  )
}

/* ── Contact Section ─────────────────────────────────────────── */

function ContactSection() {
  const { ref, visible } = useScrollReveal()

  const details = [
    { icon: <IconPhone cls="w-5 h-5" />, label: 'WhatsApp', value: '+234 809 744 4087', href: `https://wa.me/${WHATSAPP}` },
    { icon: <IconPhone cls="w-5 h-5" />, label: 'WhatsApp (alt)', value: '+234 817 158 3601', href: 'https://wa.me/2348171583601' },
    { icon: <IconMail cls="w-5 h-5" />, label: 'Email', value: EMAIL, href: `mailto:${EMAIL}` },
    { icon: <IconPin cls="w-5 h-5" />, label: 'Location', value: 'Lagos, Nigeria', href: null },
  ]

  const socials = [
    { icon: <IconInstagram cls="w-5 h-5" />, label: 'Instagram', href: `https://www.instagram.com/${INSTAGRAM}` },
    { icon: <IconFacebook cls="w-5 h-5" />, label: 'Facebook', href: `https://www.facebook.com/${FACEBOOK}` },
    { icon: <IconWhatsApp cls="w-5 h-5" />, label: 'WhatsApp', href: `https://wa.me/${WHATSAPP}` },
  ]

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="stitch-divider mb-16" />

        <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
          <div>
            <p className="text-rust font-body text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Get in Touch
            </p>
            <h2 className="font-heading text-espresso text-4xl md:text-5xl font-semibold leading-tight mb-6">
              Let's make your<br />pair.
            </h2>
            <p className="font-body text-ink/65 text-base leading-relaxed mb-8 max-w-sm">
              All orders start with a WhatsApp message. Tell us what you want and we'll handle the rest — measurements, leather selection, delivery.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] text-white font-body font-semibold px-7 py-4 hover:bg-[#1fb85a] transition-colors duration-200"
            >
              <IconWhatsApp cls="w-5 h-5" />
              Start Your Order
            </a>
          </div>

          <div>
            <div className="space-y-5 mb-10">
              {details.map(d => (
                <div key={d.label} className="flex items-start gap-4">
                  <div className="text-rust mt-0.5 flex-shrink-0">{d.icon}</div>
                  <div>
                    <p className="font-body text-ink/45 text-xs uppercase tracking-wider mb-0.5">{d.label}</p>
                    {d.href ? (
                      <a
                        href={d.href}
                        target={d.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="font-body text-espresso font-medium hover:text-rust transition-colors duration-200"
                      >
                        {d.value}
                      </a>
                    ) : (
                      <p className="font-body text-espresso font-medium">{d.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="font-body text-ink/45 text-xs uppercase tracking-wider mb-4">Follow Us</p>
              <div className="flex gap-3">
                {socials.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-10 h-10 border border-tan/40 flex items-center justify-center text-espresso hover:text-cream hover:bg-espresso hover:border-espresso transition-all duration-200"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Footer ──────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-ink text-cream/60 py-12">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid sm:grid-cols-3 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="bg-white rounded-sm p-1 flex-shrink-0">
                <img src={hibeeLogo} alt="Hibeefootwear" className="h-8 w-auto" />
              </div>
              <h3 className="font-heading text-cream text-lg font-semibold">Hibeefootwear</h3>
            </div>
            <p className="font-body text-sm leading-relaxed text-cream/50 max-w-xs">
              Bespoke handmade leather footwear from Lagos, Nigeria. Every pair made to order. Est. 2014.
            </p>
            <p className="font-body text-xs text-cream/30 mt-3">{RC}</p>
          </div>

          <div>
            <p className="font-body text-cream/80 text-xs font-semibold tracking-widest uppercase mb-4">Navigate</p>
            <div className="flex flex-col gap-2">
              {['About', 'Process', 'Shop', 'Contact'].map(l => (
                <a
                  key={l}
                  href={`#${l.toLowerCase()}`}
                  className="font-body text-sm text-cream/50 hover:text-tan transition-colors duration-200"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-body text-cream/80 text-xs font-semibold tracking-widest uppercase mb-4">Contact</p>
            <div className="flex flex-col gap-2">
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-body text-sm text-cream/50 hover:text-tan transition-colors duration-200">
                <IconWhatsApp cls="w-4 h-4 text-tan flex-shrink-0" />
                <span>+234 809 744 4087</span>
              </a>
              <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 font-body text-sm text-cream/50 hover:text-tan transition-colors duration-200">
                <IconMail cls="w-4 h-4 text-tan flex-shrink-0" />
                <span>{EMAIL}</span>
              </a>
              <a href={`https://www.instagram.com/${INSTAGRAM}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-body text-sm text-cream/50 hover:text-tan transition-colors duration-200">
                <IconInstagram cls="w-4 h-4 text-tan flex-shrink-0" />
                <span>@hibeefootwear</span>
              </a>
              <a href="https://www.facebook.com/hibeefootwear" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-body text-sm text-cream/50 hover:text-tan transition-colors duration-200">
                <IconFacebook cls="w-4 h-4 text-tan flex-shrink-0" />
                <span>hibeefootwear</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs text-cream/35">
            © {new Date().getFullYear()} Hibeefootwear. All rights reserved.
          </p>
          <p className="font-body text-xs text-cream/25 italic font-heading">
            "Put It On"
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ── Cart Drawer ─────────────────────────────────────────────── */

function CartDrawer({
  cart, isOpen, onClose, onUpdateQty, onRemove,
}: {
  cart: CartItem[]
  isOpen: boolean
  onClose: () => void
  onUpdateQty: (id: number, qty: number) => void
  onRemove: (id: number) => void
}) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm z-50 bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-tan/25">
          <h2 className="font-heading text-espresso text-xl font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-1.5 text-ink/50 hover:text-rust transition-colors duration-200"
          >
            <IconClose cls="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <IconCart cls="w-10 h-10 text-tan/60 mb-4" />
              <p className="font-body text-ink/45 text-sm mb-3">Your cart is empty</p>
              <a
                href="#shop"
                onClick={onClose}
                className="font-body text-sm font-semibold text-rust hover:text-espresso transition-colors duration-200"
              >
                Browse the shop →
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex gap-3 bg-white border border-tan/15 p-3">
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden bg-espresso/5">
                    <img
                      src={item.imgSrc}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-heading text-espresso text-sm font-semibold leading-tight truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => onRemove(item.id)}
                        aria-label="Remove item"
                        className="text-ink/35 hover:text-rust transition-colors flex-shrink-0"
                      >
                        <IconClose cls="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-ink/50 font-body text-xs mb-2">{fmt(item.price)} each</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-tan/30">
                        <button
                          onClick={() => onUpdateQty(item.id, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center text-espresso text-sm hover:bg-tan/20 transition-colors font-bold"
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-body text-sm text-espresso">{item.qty}</span>
                        <button
                          onClick={() => onUpdateQty(item.id, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center text-espresso text-sm hover:bg-tan/20 transition-colors font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-heading text-espresso text-sm font-bold">
                        {fmt(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-6 py-5 border-t border-tan/25 bg-white">
            <div className="stitch-divider mb-4" />
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-body text-ink/60 text-sm">Estimated Total</span>
              <span className="font-heading text-espresso text-2xl font-bold">{fmt(total)}</span>
            </div>
            <p className="text-ink/40 text-xs font-body mb-4 leading-relaxed">
              Final price confirmed via WhatsApp. No payment taken here.
            </p>
            <a
              href={buildWAUrl(cart)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] text-white font-body font-semibold py-3.5 hover:bg-[#1fb85a] transition-colors duration-200"
            >
              <IconWhatsApp cls="w-5 h-5" />
              Order via WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  )
}

/* ── Back to Top ─────────────────────────────────────────────── */

function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const fn = () => setShow(window.scrollY > 500)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-30 w-11 h-11 bg-espresso text-cream flex items-center justify-center shadow-lg hover:bg-rust transition-all duration-300 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
      }`}
    >
      <IconChevronUp />
    </button>
  )
}

/* ── App ─────────────────────────────────────────────────────── */

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('hibee-cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [cartOpen, setCartOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('hibee-cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(product: Product) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...product, qty: 1 }]
    })
    setCartOpen(true)
  }

  function updateQty(id: number, qty: number) {
    if (qty < 1) {
      setCart(prev => prev.filter(i => i.id !== id))
    } else {
      setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
    }
  }

  function removeItem(id: number) {
    setCart(prev => prev.filter(i => i.id !== id))
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="min-h-screen bg-white font-body text-ink">
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <HeroSection />
      <AboutSection />
      <ProcessSection />
      <ShopSection onAddToCart={addToCart} />
      <ContactSection />
      <Footer />
      <CartDrawer
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onUpdateQty={updateQty}
        onRemove={removeItem}
      />
      <BackToTop />
    </div>
  )
}
