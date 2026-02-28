-- BanglaDress AI - Sample Design Seeds
-- Run after schema.sql in Supabase SQL editor

-- Note: Replace 'YOUR_ADMIN_USER_ID' with actual user UUID from auth.users

INSERT INTO designs (title, description, price, category, image_url, status, measurements) VALUES
('লাল কাতান থ্রি পিস', 'বিয়ের অনুষ্ঠানের জন্য সুন্দর লাল কাতান কাপড়ের থ্রি পিস ড্রেস', 4500, 'ব্রাইডাল', 'https://placehold.co/600x800/c0392b/ffffff?text=লাল+কাতান', 'approved', '{"bust": 38, "waist": 32, "hip": 40, "height": 62, "sleeve": 24, "kameez_length": 42}'),
('সবুজ জর্জেট ক্যাজুয়াল', 'দৈনন্দিন ব্যবহারের জন্য হালকা সবুজ জর্জেট কাপড়', 1800, 'ক্যাজুয়াল', 'https://placehold.co/600x800/27ae60/ffffff?text=সবুজ+জর্জেট', 'approved', '{"bust": 36, "waist": 30, "hip": 38, "height": 60, "sleeve": 22, "kameez_length": 40}'),
('নীল মসলিন ফরমাল', 'অফিসের জন্য এলিগ্যান্ট নীল মসলিন থ্রি পিস', 2800, 'ফরমাল', 'https://placehold.co/600x800/2980b9/ffffff?text=নীল+মসলিন', 'approved', '{"bust": 40, "waist": 34, "hip": 42, "height": 64, "sleeve": 25, "kameez_length": 44}'),
('বেগুনি সিল্ক পার্টি', 'পার্টি ও উৎসবের জন্য বেগুনি সিল্ক কাপড়', 3500, 'পার্টি', 'https://placehold.co/600x800/8e44ad/ffffff?text=বেগুনি+সিল্ক', 'approved', '{"bust": 38, "waist": 32, "hip": 40, "height": 62, "sleeve": 24, "kameez_length": 43}'),
('কমলা বাটিক ক্যাজুয়াল', 'ট্রেন্ডি বাটিক প্রিন্টের থ্রি পিস', 2200, 'ক্যাজুয়াল', 'https://placehold.co/600x800/d35400/ffffff?text=কমলা+বাটিক', 'approved', '{"bust": 36, "waist": 30, "hip": 38, "height": 61, "sleeve": 23, "kameez_length": 41}'),
('সোনালী জামদানি ব্রাইডাল', 'ঐতিহ্যবাহী জামদানি কাপড়ের বিশেষ ব্রাইডাল কালেকশন', 8500, 'ব্রাইডাল', 'https://placehold.co/600x800/f39c12/ffffff?text=সোনালী+জামদানি', 'approved', '{"bust": 38, "waist": 32, "hip": 40, "height": 62, "sleeve": 24, "kameez_length": 45}'),
('গোলাপি চিফন ফরমাল', 'কর্পোরেট মিটিংয়ের জন্য পেস্টেল পিংক চিফন', 3200, 'ফরমাল', 'https://placehold.co/600x800/e91e8c/ffffff?text=গোলাপি+চিফন', 'approved', '{"bust": 37, "waist": 31, "hip": 39, "height": 61, "sleeve": 23, "kameez_length": 42}'),
('কালো এমব্রয়ডারি পার্টি', 'স্টাইলিশ কালো কাপড়ে এমব্রয়ডারি ওয়ার্ক', 4200, 'পার্টি', 'https://placehold.co/600x800/2c3e50/ffffff?text=কালো+এমব্রয়ডারি', 'approved', '{"bust": 39, "waist": 33, "hip": 41, "height": 63, "sleeve": 24, "kameez_length": 43}'),
('ফিরোজা লিনেন ক্যাজুয়াল', 'গ্রীষ্মকালীন ব্যবহারের জন্য ফিরোজা লিনেন', 1600, 'ক্যাজুয়াল', 'https://placehold.co/600x800/1abc9c/ffffff?text=ফিরোজা+লিনেন', 'approved', '{"bust": 36, "waist": 29, "hip": 37, "height": 59, "sleeve": 22, "kameez_length": 40}'),
('মেরুন ভেলভেট ব্রাইডাল', 'শীতকালীন বিয়ের জন্য মেরুন ভেলভেট থ্রি পিস', 6500, 'ব্রাইডাল', 'https://placehold.co/600x800/6c1a1a/ffffff?text=মেরুন+ভেলভেট', 'approved', '{"bust": 38, "waist": 32, "hip": 40, "height": 62, "sleeve": 25, "kameez_length": 44}');
