-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  serial_number TEXT,
  sku TEXT UNIQUE,
  brand TEXT,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  discount_price NUMERIC(10, 2),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,                    -- single primary image URL
  image_urls TEXT[] DEFAULT '{}',    -- array of additional image URLs
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- PRODUCT VARIANTS
-- ============================================
CREATE TABLE product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  color TEXT,
  storage TEXT,
  ram TEXT,
  price NUMERIC(10, 2),
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- STOCK HISTORY (audit log)
-- ============================================
CREATE TABLE stock_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  changed_by TEXT,
  old_quantity INTEGER,
  new_quantity INTEGER,
  reason TEXT,
  changed_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- AUTO-UPDATE updated_at on products
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (authenticated admin only)
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_history ENABLE ROW LEVEL SECURITY;

-- Categories RLS
CREATE POLICY "Admin full access on categories"
  ON categories FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Products RLS
CREATE POLICY "Admin full access on products"
  ON products FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Product Variants RLS
CREATE POLICY "Admin full access on product_variants"
  ON product_variants FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Stock History RLS
CREATE POLICY "Admin full access on stock_history"
  ON stock_history FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Public Read Policies (for Storefront website access)
CREATE POLICY "Allow public read access to categories"
  ON categories FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow public read access to products"
  ON products FOR SELECT TO public
  USING (true);

CREATE POLICY "Allow public read access to product_variants"
  ON product_variants FOR SELECT TO public
  USING (true);