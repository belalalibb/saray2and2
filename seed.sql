-- SEED DATA — Saraya Al-Andalus
-- Default super admin (email: admin@saraya-andalus.com / password: SarayaAdmin@2026)
INSERT OR IGNORE INTO admin_users (id, email, name, password_hash, password_salt, role) VALUES
  (1, 'admin@saraya-andalus.com', 'المدير العام', 'b226307e53202b64db99ec10cf49d142f5fe399b82408a410f7832fd3528ca70', 'ca159db9492ec05ad427b767d85f2f04', 'super_admin');

-- Settings (approved company data ONLY)
INSERT OR REPLACE INTO settings (key, value) VALUES
  ('company_name_ar', 'سرايا الأندلس للأثاث الفندقي والضيافة'),
  ('company_name_en', 'Saraya Al-Andalus Hospitality Furniture'),
  ('phone', '10 41617881'),
  ('whatsapp', '01227932213'),
  ('address_ar', 'ش عبدالله بن طلحه من جمال عبد الناصر، شرق المدينة'),
  ('whatsapp_default_message', 'مرحباً، أرغب في الاستفسار عن منتجات وخدمات سرايا الأندلس للأثاث الفندقي والضيافة.'),
  ('whatsapp_product_message', 'مرحباً، أرغب في الاستفسار عن منتج: [PRODUCT]'),
  ('seo_default_title', 'سرايا الأندلس للأثاث الفندقي والضيافة'),
  ('seo_default_description', 'حلول أثاث وتجهيز متكاملة للمشروعات الفندقية والضيافة — أثاث الغرف، اللوبي، المطاعم والكافيهات، والأثاث المخصص للمشروعات.'),
  ('footer_about_ar', 'سرايا الأندلس توفر حلول أثاث وتجهيز متكاملة للمشروعات الفندقية والضيافة، مع التركيز على الجودة والتصميم والتنفيذ حسب احتياجات المشروع.');

-- Categories
INSERT OR IGNORE INTO categories (id, slug, name_ar, name_en, description_ar, image_url, icon, sort_order) VALUES
  (1, 'hotel-rooms', 'أثاث غرف الفنادق', 'Hotel Room Furniture', 'أثاث متكامل لغرف الفنادق والشقق الفندقية بتصميمات عملية وفاخرة.', '/static/images/bedroom-1.jpg', 'fa-bed', 1),
  (2, 'lobby', 'أثاث اللوبي والاستقبال', 'Lobby Furniture', 'أثاث استقبال ولوبي يعكس فخامة المكان من اللحظة الأولى.', '/static/images/living-3.jpg', 'fa-couch', 2),
  (3, 'restaurants-cafes', 'أثاث المطاعم والكافيهات', 'Restaurant & Café Furniture', 'طاولات وكراسي وتجهيزات مطاعم وكافيهات بخامات تتحمل الاستخدام التجاري.', '/static/images/dining-1.jpg', 'fa-utensils', 3),
  (4, 'office-workspace', 'أثاث المكاتب ومساحات العمل', 'Office & Workspace', 'حلول مكتبية عملية للمنشآت الفندقية والإدارية.', '/static/images/office-1.jpg', 'fa-briefcase', 4),
  (5, 'storage', 'حلول التخزين', 'Storage Solutions', 'وحدات تخزين ذكية تناسب الغرف الفندقية والمرافق.', '/static/images/storage-1.jpg', 'fa-box-open', 5),
  (6, 'custom', 'الأثاث المخصص للمشروعات', 'Custom Project Furniture', 'تصميم وتنفيذ أثاث حسب احتياجات ومواصفات كل مشروع.', '/static/images/living-1.jpg', 'fa-drafting-compass', 6);

-- Services
INSERT OR IGNORE INTO services (id, slug, title_ar, title_en, short_desc_ar, description_ar, icon, image_url, sort_order) VALUES
  (1, 'custom-design', 'تصميم أثاث حسب الطلب', 'Custom Furniture Design', 'تصميم قطع وتجهيزات مخصصة تناسب هوية مشروعك.', 'نصمم الأثاث حسب مواصفات مشروعك الفندقي من حيث الخامات والمقاسات والتشطيبات، بما يتوافق مع الهوية البصرية للمكان.', 'fa-pencil-ruler', '/static/images/bedroom-2.jpg', 1),
  (2, 'project-fitout', 'تجهيز المشروعات الفندقية', 'Hospitality Project Fit-out', 'تجهيز متكامل للفنادق والشقق الفندقية والمنتجعات.', 'نتولى تجهيز المشروعات الفندقية بالكامل من الأثاث والتجهيزات، مع الالتزام بالمواصفات والجداول الزمنية للمشروع.', 'fa-hotel', '/static/images/living-5.jpg', 2),
  (3, 'supply', 'توريد الأثاث', 'Furniture Supply', 'توريد أثاث فندقي وضيافة بجودة عالية.', 'نوفر توريد الأثاث الفندقي وأثاث الضيافة للمشروعات بمختلف أحجامها.', 'fa-truck', '/static/images/dining-3.jpg', 3),
  (4, 'space-planning', 'تخطيط المساحات', 'Space Planning', 'حلول تخطيط ذكية للمساحات الفندقية.', 'نساعدك على الاستفادة المثلى من المساحات عبر تخطيط عملي يوازن بين الجمال والوظيفة.', 'fa-vector-square', '/static/images/office-2.jpg', 4),
  (5, 'delivery-assembly', 'التوصيل والتركيب', 'Delivery & Assembly', 'توصيل وتركيب احترافي في الموقع.', 'فريق متخصص للتوصيل والتركيب داخل موقع المشروع مع الالتزام بمعايير الجودة والسلامة.', 'fa-tools', '/static/images/storage-2.jpg', 5),
  (6, 'after-sales', 'دعم ما بعد البيع', 'After-Sales Support', 'متابعة ودعم مستمر بعد التسليم.', 'نقدم دعم ما بعد البيع ومتابعة حالة التجهيزات لضمان استمرارية الجودة.', 'fa-headset', '/static/images/living-2.jpg', 6);

-- Homepage sections
INSERT OR IGNORE INTO home_sections (section_key, title_ar, title_en, content_ar, content_en, image_url, cta_text_ar, cta_url, sort_order, is_active) VALUES
  ('hero', 'أثاث فندقي يليق بمشروعك', 'Hospitality Furniture That Defines Your Project', 'سرايا الأندلس توفر حلول أثاث وتجهيز متكاملة للمشروعات الفندقية والضيافة، مع التركيز على الجودة والتصميم والتنفيذ حسب احتياجات المشروع.', 'Integrated furniture and fit-out solutions for hospitality projects.', '/static/images/hero-main.jpg', 'استكشف منتجاتنا', '/products', 1, 1),
  ('about', 'من نحن', 'About Us', 'سرايا الأندلس للأثاث الفندقي والضيافة — شريكك في تجهيز الفنادق والشقق الفندقية والمنتجعات والمطاعم والكافيهات بأثاث يجمع بين الفخامة والعملية.', NULL, NULL, 'اعرف المزيد', '/about', 2, 1),
  ('categories', 'حلولنا وفئات منتجاتنا', 'Our Solutions', NULL, NULL, NULL, NULL, NULL, 3, 1),
  ('featured', 'منتجات مميزة', 'Featured Products', NULL, NULL, NULL, NULL, NULL, 4, 1),
  ('services', 'خدماتنا', 'Our Services', NULL, NULL, NULL, NULL, NULL, 5, 1),
  ('projects', 'مشاريعنا', 'Our Projects', NULL, NULL, NULL, NULL, NULL, 6, 1),
  ('why_us', 'لماذا سرايا الأندلس؟', 'Why Choose Us', NULL, NULL, NULL, NULL, NULL, 7, 1),
  ('cta', 'ابدأ مشروعك معنا', 'Start Your Project With Us', 'تواصل معنا اليوم للحصول على عرض سعر مخصص لمشروعك الفندقي.', NULL, NULL, 'اطلب عرض سعر', '/quote', 8, 1);

-- Why us points
INSERT OR IGNORE INTO why_us_points (icon, title_ar, description_ar, sort_order) VALUES
  ('fa-gem', 'جودة الخامات', 'نختار خامات تتحمل الاستخدام الفندقي المكثف دون التنازل عن الفخامة.', 1),
  ('fa-drafting-compass', 'تصميم حسب المشروع', 'كل مشروع له طابعه — نصمم وننفذ حسب هوية واحتياج كل عميل.', 2),
  ('fa-handshake', 'شريك B2B موثوق', 'نتعامل مع أصحاب الفنادق والمشروعات بمنهجية احترافية من العرض حتى التسليم.', 3),
  ('fa-clock', 'التزام بالمواعيد', 'جداول تنفيذ واضحة والتزام بمواعيد تسليم المشروعات.', 4);

-- DEMO products (marked is_demo=1, using real catalog images from company PDF)
INSERT OR IGNORE INTO products (id, slug, name_ar, name_en, short_desc_ar, description_ar, category_id, main_image, materials_ar, dimensions, features_ar, is_featured, is_new, status, is_demo) VALUES
  (1, 'hotel-bed-classic', 'سرير فندقي بتصميم خشبي عصري', 'Modern Wooden Hotel Bed', 'سرير فندقي بقاعدة خشبية متينة وتصميم عصري هادئ.', 'سرير فندقي مصمم للاستخدام المكثف في الغرف الفندقية، بقاعدة خشبية متينة وظهر مريح، مع إمكانية التخصيص في المقاسات والتشطيبات حسب المشروع.', 1, '/static/images/bedroom-1.jpg', 'خشب طبيعي معالج', 'حسب الطلب', 'قاعدة متينة للاستخدام الفندقي\nإمكانية تخصيص المقاسات\nتشطيبات متعددة', 1, 1, 'published', 1),
  (2, 'hotel-wardrobe', 'دولاب غرفة فندقية', 'Hotel Room Wardrobe', 'وحدة تخزين ملابس عملية للغرف الفندقية.', 'دولاب مصمم خصيصاً للغرف الفندقية بمساحات تخزين عملية وخامات تتحمل الاستخدام اليومي.', 1, '/static/images/bedroom-3.jpg', 'خشب صناعي عالي الكثافة', 'حسب الطلب', 'تصميم عملي\nخامات متينة', 1, 0, 'published', 1),
  (3, 'lobby-sofa-set', 'طقم كنب لوبي فاخر', 'Luxury Lobby Sofa Set', 'أطقم جلوس فاخرة لمناطق الاستقبال واللوبي.', 'طقم كنب مصمم لمناطق اللوبي والاستقبال الفندقي، بخامات فاخرة وألوان هادئة تضفي طابعاً راقياً على المكان.', 2, '/static/images/living-3.jpg', 'قماش مقاوم للبقع — إسفنج عالي الكثافة', 'حسب الطلب', 'خامات مقاومة للاستخدام المكثف\nتشكيلات ألوان متعددة', 1, 0, 'published', 1),
  (4, 'lounge-chairs', 'كراسي استرخاء للوبي', 'Lounge Chairs', 'كراسي استرخاء عصرية لمناطق الانتظار.', 'كراسي استرخاء بتصميم عصري تناسب مناطق الانتظار واللوبي في الفنادق والمنشآت.', 2, '/static/images/living-1.jpg', 'قماش — معدن', 'حسب الطلب', 'تصميم مريح\nهيكل متين', 0, 1, 'published', 1),
  (5, 'dining-set-hotel', 'طقم سفرة مطاعم فندقية', 'Hotel Restaurant Dining Set', 'طاولات وكراسي مطاعم بخامات تجارية متينة.', 'طقم سفرة مصمم للمطاعم الفندقية والكافيهات، بخامات تتحمل الاستخدام التجاري المكثف مع سهولة التنظيف والصيانة.', 3, '/static/images/dining-1.jpg', 'خشب — قماش مقاوم', 'حسب الطلب', 'مقاومة للاستخدام التجاري\nسهولة الصيانة', 1, 0, 'published', 1),
  (6, 'dining-table-marble', 'طاولة طعام رخامية', 'Marble Dining Table', 'طاولة طعام بسطح رخامي فاخر.', 'طاولة طعام بسطح رخامي وقاعدة متينة تناسب المطاعم الفاخرة وقاعات الطعام الفندقية.', 3, '/static/images/dining-5.jpg', 'رخام طبيعي — معدن', 'حسب الطلب', 'سطح رخامي فاخر\nقاعدة ثابتة', 0, 0, 'published', 1),
  (7, 'office-desk-exec', 'مكتب إداري', 'Executive Office Desk', 'مكتب إداري عملي للمنشآت الفندقية.', 'مكتب إداري بتصميم عملي يناسب المكاتب الإدارية في الفنادق والمنشآت التجارية.', 4, '/static/images/office-1.jpg', 'خشب صناعي عالي الجودة', 'حسب الطلب', 'تصميم عملي\nمساحات تخزين مدمجة', 0, 0, 'published', 1),
  (8, 'workspace-station', 'محطة عمل مكتبية', 'Workspace Station', 'محطات عمل لمساحات العمل المشتركة.', 'محطة عمل تناسب مساحات العمل المشتركة والمكاتب الإدارية داخل المنشآت الفندقية.', 4, '/static/images/office-4.jpg', 'خشب — معدن', 'حسب الطلب', 'تنظيم عملي\nإمكانية التوسع', 0, 1, 'published', 1),
  (9, 'storage-unit-modern', 'وحدة تخزين عصرية', 'Modern Storage Unit', 'وحدات تخزين ذكية للغرف والمرافق.', 'وحدة تخزين بتصميم عصري تناسب الغرف الفندقية والمرافق مع الاستغلال الأمثل للمساحات.', 5, '/static/images/storage-1.jpg', 'خشب صناعي', 'حسب الطلب', 'استغلال أمثل للمساحة\nتصميم عصري', 0, 0, 'published', 1),
  (10, 'shelving-unit', 'وحدة أرفف', 'Shelving Unit', 'أرفف عرض وتخزين متعددة الاستخدامات.', 'وحدة أرفف تصلح للعرض والتخزين في المرافق الفندقية والتجارية.', 5, '/static/images/storage-2.jpg', 'خشب — معدن', 'حسب الطلب', 'متعددة الاستخدامات', 0, 0, 'published', 1),
  (11, 'custom-suite', 'تجهيز جناح فندقي متكامل', 'Complete Suite Fit-out', 'تجهيز متكامل للأجنحة الفندقية حسب الطلب.', 'حل متكامل لتجهيز الأجنحة الفندقية يشمل غرفة النوم ومنطقة الجلوس بتصميم موحد حسب هوية المشروع.', 6, '/static/images/bedroom-4.jpg', 'حسب مواصفات المشروع', 'حسب الطلب', 'تصميم موحد\nتنفيذ متكامل\nحسب هوية المشروع', 1, 0, 'published', 1),
  (12, 'custom-reception', 'تجهيز منطقة استقبال', 'Reception Area Fit-out', 'تصميم وتنفيذ مناطق الاستقبال حسب الهوية.', 'تصميم وتنفيذ منطقة استقبال متكاملة تعكس هوية المنشأة، من الكاونتر إلى مناطق الجلوس.', 6, '/static/images/living-5.jpg', 'حسب مواصفات المشروع', 'حسب الطلب', 'تصميم حسب الهوية\nتنفيذ متكامل', 0, 0, 'published', 1);

-- Product gallery images
INSERT OR IGNORE INTO product_images (product_id, url, sort_order) VALUES
  (1, '/static/images/bedroom-1.jpg', 1), (1, '/static/images/bedroom-2.jpg', 2), (1, '/static/images/bedroom-5.jpg', 3),
  (2, '/static/images/bedroom-3.jpg', 1), (2, '/static/images/bedroom-6.jpg', 2),
  (3, '/static/images/living-3.jpg', 1), (3, '/static/images/living-2.jpg', 2),
  (4, '/static/images/living-1.jpg', 1), (4, '/static/images/living-4.jpg', 2),
  (5, '/static/images/dining-1.jpg', 1), (5, '/static/images/dining-4.jpg', 2), (5, '/static/images/dining-6.jpg', 3),
  (6, '/static/images/dining-5.jpg', 1), (6, '/static/images/dining-3.jpg', 2),
  (7, '/static/images/office-1.jpg', 1), (7, '/static/images/office-3.jpg', 2),
  (8, '/static/images/office-4.jpg', 1), (8, '/static/images/office-5.jpg', 2),
  (9, '/static/images/storage-1.jpg', 1), (9, '/static/images/storage-3.jpg', 2),
  (10, '/static/images/storage-2.jpg', 1), (10, '/static/images/storage-6.jpg', 2),
  (11, '/static/images/bedroom-4.jpg', 1), (11, '/static/images/bedroom-7.jpg', 2), (11, '/static/images/bedroom-8.jpg', 3),
  (12, '/static/images/living-5.jpg', 1), (12, '/static/images/living-6.jpg', 2);

-- DEMO projects
INSERT OR IGNORE INTO projects (id, slug, title_ar, description_ar, cover_image, project_type, is_featured, status) VALUES
  (1, 'hotel-rooms-demo', 'تجهيز غرف فندقية', 'نموذج لتجهيز غرف فندقية متكاملة بأثاث عصري. (بيانات تجريبية للعرض)', '/static/images/bedroom-5.jpg', 'hotel', 1, 'published'),
  (2, 'restaurant-demo', 'تجهيز مطعم', 'نموذج لتجهيز مطعم بطاولات وكراسي بخامات تجارية. (بيانات تجريبية للعرض)', '/static/images/dining-7.jpg', 'restaurant', 1, 'published'),
  (3, 'lobby-demo', 'تجهيز لوبي واستقبال', 'نموذج لتجهيز منطقة لوبي واستقبال فندقية. (بيانات تجريبية للعرض)', '/static/images/living-7.jpg', 'hotel', 0, 'published');

INSERT OR IGNORE INTO project_images (project_id, url, sort_order) VALUES
  (1, '/static/images/bedroom-5.jpg', 1), (1, '/static/images/bedroom-6.jpg', 2),
  (2, '/static/images/dining-7.jpg', 1), (2, '/static/images/dining-8.jpg', 2), (2, '/static/images/dining-2.jpg', 3),
  (3, '/static/images/living-7.jpg', 1), (3, '/static/images/living-8.jpg', 2);
