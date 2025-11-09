-- =====================================================
-- SEED DEFAULT CATEGORIES
-- =====================================================
-- Note: This is a template. Default categories will be created
-- automatically for each user via a trigger or when they first log in.

-- Function to create default categories for new users
CREATE OR REPLACE FUNCTION create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  -- Default expense categories
  INSERT INTO categories (user_id, name, type, icon, color) VALUES
    (NEW.id, 'Makanan & Minuman', 'expense', '🍔', '#EF4444'),
    (NEW.id, 'Transportasi', 'expense', '🚗', '#F59E0B'),
    (NEW.id, 'Belanja', 'expense', '🛒', '#8B5CF6'),
    (NEW.id, 'Hiburan', 'expense', '🎬', '#EC4899'),
    (NEW.id, 'Tagihan', 'expense', '💳', '#6366F1'),
    (NEW.id, 'Kesehatan', 'expense', '⚕️', '#10B981'),
    (NEW.id, 'Pendidikan', 'expense', '📚', '#3B82F6'),
    (NEW.id, 'Lainnya', 'expense', '📌', '#6B7280');

  -- Default income categories
  INSERT INTO categories (user_id, name, type, icon, color) VALUES
    (NEW.id, 'Gaji', 'income', '💰', '#10B981'),
    (NEW.id, 'Freelance', 'income', '💼', '#3B82F6'),
    (NEW.id, 'Investasi', 'income', '📈', '#8B5CF6'),
    (NEW.id, 'Hadiah', 'income', '🎁', '#EC4899'),
    (NEW.id, 'Lainnya', 'income', '💵', '#6B7280');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default categories when profile is created
CREATE TRIGGER create_user_default_categories
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_default_categories();
