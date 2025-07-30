import { Product } from '../contexts/CartContext';
import diamondRing from '../assets/diamond-ring.jpg';
import goldNecklace from '../assets/gold-necklace.jpg';
import pearlEarrings from '../assets/pearl-earrings.jpg';
import goldBracelet from '../assets/gold-bracelet.jpg';
import roseGoldWatch from '../assets/rose-gold-watch.jpg';
import sapphireRing from '../assets/sapphire-ring.jpg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Eternal Diamond Ring',
    price: 2499,
    image: diamondRing,
    category: 'Rings',
    description: 'Exquisite diamond solitaire ring crafted in 18k white gold. Features a brilliant 1-carat diamond with exceptional clarity and fire.',
    inStock: true,
    rating: 4.9,
    reviews: 127,
  },
  {
    id: '2',
    name: 'Classic Gold Chain Necklace',
    price: 899,
    image: goldNecklace,
    category: 'Necklaces',
    description: 'Timeless 18k gold chain necklace with elegant pendant. Perfect for everyday wear or special occasions.',
    inStock: true,
    rating: 4.8,
    reviews: 89,
  },
  {
    id: '3',
    name: 'Lustrous Pearl Earrings',
    price: 649,
    image: pearlEarrings,
    category: 'Earrings',
    description: 'Beautiful freshwater pearl earrings set in 14k gold. Elegant and sophisticated for any occasion.',
    inStock: true,
    rating: 4.7,
    reviews: 156,
  },
  {
    id: '4',
    name: 'Luxury Gold Bracelet',
    price: 1299,
    image: goldBracelet,
    category: 'Bracelets',
    description: 'Intricate 18k gold bracelet with detailed craftsmanship. A statement piece that exudes luxury.',
    inStock: true,
    rating: 4.9,
    reviews: 73,
  },
  {
    id: '5',
    name: 'Rose Gold Timepiece',
    price: 3199,
    image: roseGoldWatch,
    category: 'Watches',
    description: 'Sophisticated rose gold watch with precision movement. Elegant design meets functional excellence.',
    inStock: true,
    rating: 4.8,
    reviews: 92,
  },
  {
    id: '6',
    name: 'Sapphire Crown Ring',
    price: 1899,
    image: sapphireRing,
    category: 'Rings',
    description: 'Stunning sapphire ring with diamond accents set in platinum. A truly regal piece for special moments.',
    inStock: true,
    rating: 4.9,
    reviews: 84,
  },
];

export const categories = [
  'All',
  'Rings',
  'Necklaces',
  'Earrings',
  'Bracelets',
  'Watches',
];

export const featuredProducts = products.slice(0, 3);
export const bestSellers = products.filter(p => p.rating >= 4.8);
export const newArrivals = products.slice(-3);