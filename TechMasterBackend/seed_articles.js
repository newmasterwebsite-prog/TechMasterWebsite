const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, 'src', '.env') });

const defaultLatestArticles = {
  badge: 'LATEST ARTICLES',
  heading: 'Featured Stories & Press Highlights',
  description: 'Exclusive deep dives, industry interviews, and thought leadership from Arvind Kharra & Tech Master.',
  hotBadge: 'HOT',
  hotTitle: 'Hot',
  visible: true,
  list: [
    {
      id: 'art-1',
      title: 'From influencers to trusted voices: The changing role of creators in tech buying decisions',
      excerpt: 'Authored by Arvind Kharra (Founder of TechMaster), exploring how technology creators have transitioned from mere product reviewers to trusted advisory voices driving high-stake purchase decisions.',
      category: 'CREATOR ECONOMY',
      authorName: 'Arvind Kharra',
      authorRole: 'Founder, TechMaster',
      authorAvatar: '/TechMaster.jpeg',
      date: '23.09.2026',
      readTime: '4 min read',
      views: '24,850',
      likes: '2,340',
      imageUrl: '/articles/adgully_creators.jpg',
      articleUrl: 'https://www.adgully.com/post/20995/from-influencers-to-trusted-voices-the-changing-role-of-creators-in-tech-buying-decisions#google_vignette',
      isFeatured: true,
      isHot: false,
      order: 1,
      visible: true,
      deleted: false
    },
    {
      id: 'art-2',
      title: 'Content creators decode the future of influence at Convergence India 2026',
      excerpt: 'At the 33rd Convergence India Expo, Arvind Kharra highlighted AI as an empowering support system rather than a disruptor, emphasizing authenticity and trust in digital media.',
      category: 'DIGITAL MEDIA',
      authorName: 'Communications Today',
      authorRole: 'Media Coverage',
      authorAvatar: '/Tech MAster Logo.png',
      date: '07.04.2026',
      readTime: '3 min read',
      views: '19,420',
      likes: '1,890',
      imageUrl: '/articles/convergence_india.jpg',
      articleUrl: 'https://www.communicationstoday.co.in/content-creators-decode-the-future-of-influence-at-convergence-india-2026/',
      isFeatured: false,
      isHot: true,
      order: 2,
      visible: true,
      deleted: false
    },
    {
      id: 'art-3',
      title: '5 Made-in-India AI Innovations Driving the Next Wave of Digital Transformation',
      excerpt: 'India’s AI ecosystem is moving beyond experimentation, with groundbreaking solutions solving real-world enterprise operations and digital visibility at scale.',
      category: 'ARTIFICIAL INTELLIGENCE',
      authorName: 'CXO Today',
      authorRole: 'Tech Analysis',
      authorAvatar: '/NextUniverz.jpeg',
      date: '18.09.2026',
      readTime: '5 min read',
      views: '15,630',
      likes: '1,420',
      imageUrl: '/articles/cxotoday_ai.jpg',
      articleUrl: 'https://cxotoday.com/others/5-made-in-india-ai-innovations-driving-the-next-wave-of-digital-transformation/',
      isFeatured: false,
      isHot: false,
      order: 3,
      visible: true,
      deleted: false
    },
    {
      id: 'art-4',
      title: 'AI travel planning: 7 money checks to make before booking flights, hotels',
      excerpt: 'Arvind Kharra, Founder & CEO of Tech Master, explains how AI tools can optimise total trip budgets, calculate all-in hidden costs, and evaluate travel alternatives.',
      category: 'TRAVEL TECH',
      authorName: 'CNBC TV18',
      authorRole: 'Featured Expert',
      authorAvatar: '/MasterWheels.jpeg',
      date: '17.08.2026',
      readTime: '6 min read',
      views: '28,910',
      likes: '2,780',
      imageUrl: '/articles/cnbc_travel_ai.jpg',
      articleUrl: 'https://www.cnbctv18.com/travel/ai-travel-planning-money-checks-to-make-before-booking-flights-hotels-19969900.htm',
      isFeatured: false,
      isHot: false,
      order: 4,
      visible: true,
      deleted: false
    }
  ]
};

async function seedArticles() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/techmaster';
  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB.');

    const schema = new mongoose.Schema({ key: String, value: mongoose.Schema.Types.Mixed }, { strict: false });
    const CMSData = mongoose.models.CMSData || mongoose.model('CMSData', schema, 'cmsdatas');

    for (const key of ['homepageCMS', 'homepage', 'homeData']) {
      const doc = await CMSData.findOne({ key });
      if (doc && doc.value) {
        const val = doc.value;
        val.latestArticles = defaultLatestArticles;
        await CMSData.updateOne({ key }, { $set: { value: val } });
        console.log(`Updated latestArticles in CMSData key "${key}"`);
      } else {
        await CMSData.create({ key, value: { latestArticles: defaultLatestArticles } });
        console.log(`Created CMSData key "${key}" with latestArticles`);
      }
    }

    const homepageSchema = new mongoose.Schema({}, { strict: false });
    const Homepage = mongoose.models.Homepage || mongoose.model('Homepage', homepageSchema, 'homepages');
    await Homepage.updateMany({}, { $set: { latestArticles: defaultLatestArticles } });
    console.log('Updated Homepage collection.');

    await mongoose.disconnect();
    console.log('Articles seeded successfully into MongoDB.');
  } catch (err) {
    console.warn('MongoDB seed notice:', err.message);
  }
}

seedArticles();
