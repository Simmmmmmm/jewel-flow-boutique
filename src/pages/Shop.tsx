import React, { useState, useMemo } from 'react';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const location = useLocation();
  const searchTerm = useMemo(() => new URLSearchParams(location.search).get('search')?.toLowerCase() ?? '', [location.search]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      const q = searchTerm;
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        // Featured - keep original order
        break;
    }

    return filtered;
  }, [selectedCategory, sortBy, priceRange, searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-card border-b border-border shadow-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-luxury-heading text-4xl md:text-5xl font-serif font-bold mb-4">
              Jewelry Collection
            </h1>
            <p className="text-luxury-body text-lg max-w-2xl mx-auto">
              Discover our exquisite selection of handcrafted jewelry pieces, 
              each designed to capture elegance and sophistication.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-card border border-border p-6 rounded-xl shadow-elegant">
              <h3 className="text-luxury-heading font-serif font-semibold mb-4 flex items-center">
                <SlidersHorizontal className="w-5 h-5 mr-2 text-gold-600" />
                Filters
              </h3>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-luxury-heading font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-all ${
                        selectedCategory === category
                          ? 'bg-gold-100 text-gold-800 font-medium'
                          : 'text-luxury-body hover:bg-gold-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-luxury-heading font-medium mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-luxury-body">
                    <span>${priceRange[0]}</span>
                    <span>-</span>
                    <span>${priceRange[1]}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPriceRange([0, 1000])}
                      className={priceRange[1] === 1000 ? 'bg-gold-100' : ''}
                    >
                      Under $1K
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPriceRange([1000, 2000])}
                      className={priceRange[0] === 1000 && priceRange[1] === 2000 ? 'bg-gold-100' : ''}
                    >
                      $1K - $2K
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPriceRange([2000, 3000])}
                      className={priceRange[0] === 2000 && priceRange[1] === 3000 ? 'bg-gold-100' : ''}
                    >
                      $2K - $3K
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPriceRange([3000, 5000])}
                      className={priceRange[0] === 3000 ? 'bg-gold-100' : ''}
                    >
                      $3K+
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 bg-card border border-border p-4 rounded-xl shadow-elegant">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <span className="text-luxury-body">
                  {filteredProducts.length} products
                </span>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-gold-200 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-l-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-gold-100 text-gold-800'
                        : 'text-luxury-gray hover:bg-gold-50'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-r-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-gold-100 text-gold-800'
                        : 'text-luxury-gray hover:bg-gold-50'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-luxury-body text-sm">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`${
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'
                : 'space-y-6'
            }`}>
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    product={product}
                    className={viewMode === 'list' ? 'flex' : ''}
                  />
                </div>
              ))}
            </div>

            {/* No Products Message */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Filter className="w-16 h-16 text-gold-200 mx-auto mb-4" />
                <h3 className="text-luxury-heading text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-luxury-body mb-4">
                  Try adjusting your filters to see more products
                </p>
                <Button
                  onClick={() => {
                    setSelectedCategory('All');
                    setPriceRange([0, 5000]);
                  }}
                  className="btn-luxury"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
