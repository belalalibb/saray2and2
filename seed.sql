-- Admin user: admin@example.com / admin123 (SHA-256 of 'admin123' + salt 'luxfurn')
INSERT OR IGNORE INTO users (email, name, password_hash, role) VALUES
  ('admin@example.com', 'مدير النظام', 'bf00b769c2406ff1987da86a2ab1b09255e9008d3ed4a3758e3d4bc2f656636b', 'admin');

INSERT OR IGNORE INTO categories (slug, name_ar, name_en, icon, sort_order, is_active) VALUES
  ('sofas', 'الكنب والمجالس', 'Sofas & Majlis', 'fa-couch', 1, 1),
  ('bedrooms', 'غرف النوم', 'Bedrooms', 'fa-bed', 2, 1),
  ('dining', 'غرف الطعام', 'Dining Rooms', 'fa-utensils', 3, 1),
  ('outdoor', 'الأثاث الخارجي', 'Outdoor', 'fa-umbrella-beach', 4, 1);

INSERT OR IGNORE INTO products (slug, name_ar, short_desc_ar, description_ar, features_ar, materials_ar, dimensions, main_image, category_id, is_featured, is_new, status) VALUES
  ('royal-sofa-set', 'طقم كنب ملكي فاخر', 'طقم كنب 7 مقاعد بتصميم ملكي', 'طقم كنب ملكي مصنوع من أجود أنواع الخشب الزان مع تنجيد قطيفة فاخر يضفي لمسة من الفخامة على مجلسك.', 'خشب زان تركي
قماش قطيفة مقاوم للبقع
إسفنج عالي الكثافة
ضمان 5 سنوات', 'خشب زان، قطيفة، إسفنج مضغوط', '7 مقاعد', '/static/images/hero-main.jpg', 1, 1, 1, 'published'),
  ('modern-bedroom', 'غرفة نوم مودرن كاملة', 'غرفة نوم عصرية 6 قطع', 'غرفة نوم مودرن كاملة تشمل سرير كينج ودولاب 6 أبواب وتسريحة وكومودينو عدد 2.', 'سرير كينج 200x180
دولاب 6 أبواب
مرايا بلجيكية
إضاءة LED مدمجة', 'MDF إسباني، قشرة بلوط', '6 قطع', '/static/images/hero-main.jpg', 2, 1, 0, 'published'),
  ('dining-table-8', 'طاولة طعام رخام 8 كراسي', 'طاولة رخام طبيعي مع 8 كراسي', 'طاولة طعام من الرخام الطبيعي الإيطالي مع 8 كراسي منجدة بالجلد الفاخر.', 'رخام إيطالي طبيعي
قواعد ستانلس ذهبي
كراسي جلد طبيعي', 'رخام، ستانلس، جلد', '240x110 سم', '/static/images/hero-main.jpg', 3, 0, 1, 'published');

INSERT OR IGNORE INTO services (slug, title_ar, short_desc_ar, description_ar, icon, features_ar, sort_order, is_active) VALUES
  ('interior-design', 'التصميم الداخلي', 'تصميم داخلي متكامل لمنزلك أو مشروعك', 'فريق من المصممين المحترفين لتحويل مساحتك إلى تحفة فنية تعكس ذوقك.', 'fa-drafting-compass', 'تصميم ثلاثي الأبعاد
اختيار الخامات والألوان
إشراف كامل على التنفيذ', 1, 1),
  ('custom-furniture', 'أثاث حسب الطلب', 'نصنع أثاثك بالمقاسات والتصميم الذي تريده', 'ورشنا الخاصة تنفذ أي تصميم بأعلى جودة وبالمقاسات التي تناسب مساحتك.', 'fa-hammer', 'تفصيل بمقاسات دقيقة
خامات فاخرة
تسليم في الموعد', 2, 1),
  ('hotel-furnishing', 'تأثيث الفنادق والمشاريع', 'حلول تأثيث متكاملة للفنادق والمنشآت', 'خبرة واسعة في تأثيث الفنادق والمنتجعات والمكاتب بحلول متكاملة من التصميم للتسليم.', 'fa-hotel', 'دراسة وتخطيط
تنفيذ على مراحل
صيانة دورية', 3, 1);

INSERT OR IGNORE INTO homepage_sections (section_key, title_ar, content_ar, cta_text_ar, cta_url, sort_order, is_active) VALUES
  ('hero', 'أثاث فاخر يليق بذوقك الرفيع', 'نصنع الفخامة منذ أكثر من 25 عاماً — تصاميم حصرية وخامات عالمية وجودة لا تقبل المساومة.', 'تصفح منتجاتنا', '/products', 1, 1),
  ('about', 'من نحن', 'شركة رائدة في صناعة الأثاث الفاخر، نجمع بين الحرفية التقليدية والتصميم العصري لنقدم قطعاً استثنائية.', 'اعرف المزيد', '/contact', 2, 1),
  ('categories', 'تسوق حسب الفئة', 'اكتشف مجموعاتنا المتنوعة', NULL, NULL, 3, 1),
  ('featured', 'منتجات مميزة', 'أحدث وأفخم قطعنا المختارة بعناية', 'كل المنتجات', '/products', 4, 1),
  ('services', 'خدماتنا', 'حلول متكاملة من التصميم إلى التنفيذ', 'كل الخدمات', '/services', 5, 1),
  ('projects', 'مشاريعنا', 'أعمال نفخر بها', 'كل المشاريع', '/projects', 6, 1),
  ('why_us', 'لماذا تختارنا؟', NULL, NULL, NULL, 7, 1),
  ('cta', 'جاهز لتأثيث منزل أحلامك؟', 'تواصل معنا الآن واحصل على استشارة مجانية من خبرائنا.', 'تواصل عبر واتساب', 'whatsapp', 8, 1);

INSERT OR IGNORE INTO why_us (title_ar, description_ar, icon, sort_order) VALUES
  ('خبرة 25 عاماً', 'ربع قرن من صناعة الأثاث الفاخر', 'fa-award', 1),
  ('خامات عالمية', 'نستورد أجود الخامات من إيطاليا وتركيا', 'fa-gem', 2),
  ('ضمان شامل', 'ضمان يصل إلى 5 سنوات على منتجاتنا', 'fa-shield-halved', 3),
  ('توصيل وتركيب', 'فريق متخصص للتوصيل والتركيب مجاناً', 'fa-truck-fast', 4);

INSERT OR IGNORE INTO settings (key, value) VALUES
  ('company_name_ar', 'دار الفخامة للأثاث'),
  ('company_name_en', 'Luxury Furniture House'),
  ('phone', '+966500000000'),
  ('whatsapp', '966500000000'),
  ('address_ar', 'الرياض - طريق الملك فهد'),
  ('whatsapp_default_message', 'مرحباً، أرغب بالاستفسار عن منتجاتكم'),
  ('whatsapp_product_message', 'مرحباً، أرغب بالاستفسار عن المنتج: [PRODUCT]'),
  ('seo_default_title', 'دار الفخامة للأثاث — أثاث فاخر وتصميم داخلي'),
  ('seo_default_description', 'شركة رائدة في صناعة الأثاث الفاخر والتصميم الداخلي وتأثيث الفنادق والمشاريع.'),
  ('footer_about_ar', 'دار الفخامة — نصنع الفخامة منذ أكثر من 25 عاماً.');
