from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, Text, MetaData, Table
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "mysql+pymysql://simstock_dev:1234@localhost/simutrade"

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

Base = declarative_base()

class CommunityShop(Base):
    __tablename__ = 'community_shop'

    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    cost = Column(Float, nullable=False)
    score_value = Column(Integer, nullable=False)
    emoji = Column(String(10))
    available = Column(Boolean, default=True)

# Clear existing items
print("[*] Clearing existing community shop items...")
session.query(CommunityShop).delete()
session.commit()
print("[✔] Cleared existing items.")

items = [
    # Everyday Electronics & Gadgets (Low Cost)
    {"name": "Wireless Earbuds", "desc": "High-quality Bluetooth earbuds", "cost": 89.99, "score": 2, "emoji": "🎧"},
    {"name": "Smartphone Case", "desc": "Premium protective phone case", "cost": 24.99, "score": 1, "emoji": "📱"},
    {"name": "Portable Charger", "desc": "10,000mAh power bank", "cost": 34.99, "score": 1, "emoji": "🔋"},
    {"name": "Bluetooth Speaker", "desc": "Compact wireless speaker", "cost": 79.99, "score": 2, "emoji": "🔊"},
    {"name": "Smartwatch", "desc": "Fitness tracking smartwatch", "cost": 199.99, "score": 4, "emoji": "⌚"},
    {"name": "Gaming Mouse", "desc": "RGB gaming mouse", "cost": 59.99, "score": 2, "emoji": "🖱️"},
    {"name": "Mechanical Keyboard", "desc": "RGB mechanical gaming keyboard", "cost": 129.99, "score": 3, "emoji": "⌨️"},
    {"name": "Webcam HD", "desc": "1080p streaming webcam", "cost": 69.99, "score": 2, "emoji": "📹"},
    
    # Home & Living (Low-Medium Cost)
    {"name": "Coffee Maker", "desc": "Programmable drip coffee maker", "cost": 89.99, "score": 2, "emoji": "☕"},
    {"name": "Air Fryer", "desc": "5-quart digital air fryer", "cost": 149.99, "score": 3, "emoji": "🍟"},
    {"name": "Robot Vacuum", "desc": "Smart robot vacuum cleaner", "cost": 299.99, "score": 5, "emoji": "🤖"},
    {"name": "Smart Thermostat", "desc": "WiFi programmable thermostat", "cost": 199.99, "score": 4, "emoji": "🌡️"},
    {"name": "Gaming Chair", "desc": "Ergonomic gaming chair", "cost": 249.99, "score": 5, "emoji": "🪑"},
    {"name": "Standing Desk", "desc": "Height-adjustable desk", "cost": 399.99, "score": 7, "emoji": "🖥️"},
    {"name": "Smart TV 55\"", "desc": "4K Smart LED TV", "cost": 599.99, "score": 10, "emoji": "📺"},
    
    # Fashion & Accessories (Various Prices)
    {"name": "Designer Jeans", "desc": "Premium denim jeans", "cost": 149.99, "score": 3, "emoji": "👖"},
    {"name": "Leather Wallet", "desc": "Genuine leather bifold wallet", "cost": 79.99, "score": 2, "emoji": "💼"},
    {"name": "Sunglasses", "desc": "UV protection designer sunglasses", "cost": 189.99, "score": 4, "emoji": "🕶️"},
    {"name": "Running Shoes", "desc": "Professional athletic running shoes", "cost": 159.99, "score": 3, "emoji": "👟"},
    {"name": "Leather Jacket", "desc": "Genuine leather motorcycle jacket", "cost": 349.99, "score": 6, "emoji": "🧥"},
    {"name": "Designer Handbag", "desc": "Luxury leather handbag", "cost": 599.99, "score": 10, "emoji": "👜"},
    
    # Hobbies & Entertainment (Low-Medium Cost)
    {"name": "Guitar", "desc": "Acoustic steel-string guitar", "cost": 299.99, "score": 5, "emoji": "🎸"},
    {"name": "Art Supplies Set", "desc": "Professional drawing and painting kit", "cost": 129.99, "score": 3, "emoji": "🎨"},
    {"name": "Board Game Collection", "desc": "Premium strategy board games", "cost": 179.99, "score": 4, "emoji": "🎲"},
    {"name": "DSLR Camera", "desc": "Entry-level DSLR with lens", "cost": 799.99, "score": 12, "emoji": "📷"},
    {"name": "Drone", "desc": "4K camera drone", "cost": 649.99, "score": 11, "emoji": "🚁"},
    {"name": "VR Headset", "desc": "Virtual reality gaming headset", "cost": 399.99, "score": 7, "emoji": "🥽"},
    
    # Fitness & Health (Medium Cost)
    {"name": "Treadmill", "desc": "Folding electric treadmill", "cost": 899.99, "score": 15, "emoji": "🏃"},
    {"name": "Home Gym Set", "desc": "Complete weight training set", "cost": 1299.99, "score": 20, "emoji": "🏋️"},
    {"name": "Massage Chair", "desc": "Full-body massage recliner", "cost": 1899.99, "score": 30, "emoji": "💆"},
    {"name": "Bike", "desc": "High-performance road bike", "cost": 1599.99, "score": 25, "emoji": "🚴"},
    
    # Transportation (Medium-High Cost)
    {"name": "Electric Scooter", "desc": "Long-range electric scooter", "cost": 699.99, "score": 12, "emoji": "🛴"},
    {"name": "Electric Bike", "desc": "Commuter e-bike", "cost": 1899.99, "score": 30, "emoji": "🚲"},
    {"name": "Motorcycle", "desc": "Sport touring motorcycle", "cost": 12999.99, "score": 80, "emoji": "🏍️"},
    {"name": "Used Car", "desc": "Reliable used sedan", "cost": 18999.99, "score": 100, "emoji": "🚗"},
    {"name": "New Car", "desc": "Brand new mid-size sedan", "cost": 32999.99, "score": 150, "emoji": "🚙"},
    {"name": "Luxury Car", "desc": "Luxury sedan with premium features", "cost": 65999.99, "score": 250, "emoji": "🚘"},
    {"name": "Sports Car", "desc": "High-performance sports car", "cost": 89999.99, "score": 300, "emoji": "🏎️"},
    
    # Education & Skills (Low-Medium Cost)
    {"name": "Online Course", "desc": "Professional certification course", "cost": 199.99, "score": 4, "emoji": "🎓"},
    {"name": "Language Learning", "desc": "1-year premium language app", "cost": 149.99, "score": 3, "emoji": "🗣️"},
    {"name": "Coding Bootcamp", "desc": "3-month intensive coding program", "cost": 2999.99, "score": 45, "emoji": "💻"},
    {"name": "University Course", "desc": "Single semester university course", "cost": 4999.99, "score": 60, "emoji": "🏛️"},
    
    # Travel & Experiences (Various Prices)
    {"name": "Weekend Getaway", "desc": "2-night hotel stay in nearby city", "cost": 399.99, "score": 7, "emoji": "🏨"},
    {"name": "Concert Tickets", "desc": "Premium seats to popular concert", "cost": 299.99, "score": 5, "emoji": "🎵"},
    {"name": "Spa Day", "desc": "Full day luxury spa treatment", "cost": 449.99, "score": 8, "emoji": "🧖"},
    {"name": "Skydiving", "desc": "Tandem skydiving experience", "cost": 299.99, "score": 5, "emoji": "🪂"},
    {"name": "Cooking Class", "desc": "Professional chef cooking workshop", "cost": 179.99, "score": 4, "emoji": "👨‍🍳"},
    {"name": "Wine Tasting", "desc": "Premium winery tour and tasting", "cost": 249.99, "score": 5, "emoji": "🍷"},
    {"name": "Beach Vacation", "desc": "5-day tropical beach resort", "cost": 1999.99, "score": 32, "emoji": "🏖️"},
    {"name": "European Trip", "desc": "10-day European tour package", "cost": 4999.99, "score": 60, "emoji": "✈️"},
    {"name": "Safari Adventure", "desc": "African safari expedition", "cost": 7999.99, "score": 80, "emoji": "🦁"},
    
    # Business & Investment (Medium-High Cost)
    {"name": "Business License", "desc": "Small business registration package", "cost": 999.99, "score": 18, "emoji": "📋"},
    {"name": "Website Development", "desc": "Professional business website", "cost": 2999.99, "score": 45, "emoji": "🌐"},
    {"name": "Marketing Campaign", "desc": "3-month digital marketing package", "cost": 4999.99, "score": 60, "emoji": "📊"},
    {"name": "Office Space", "desc": "6-month shared office rental", "cost": 7999.99, "score": 80, "emoji": "🏢"},
    {"name": "Equipment Lease", "desc": "Professional equipment rental", "cost": 12999.99, "score": 100, "emoji": "⚙️"},
    {"name": "Small Business Loan", "desc": "Startup capital for small business", "cost": 24999.99, "score": 150, "emoji": "💰"},
    
    # Food & Dining (Low-Medium Cost)
    {"name": "Coffee Subscription", "desc": "Monthly premium coffee delivery", "cost": 99.99, "score": 2, "emoji": "☕"},
    {"name": "Fine Dining", "desc": "Michelin-starred restaurant meal", "cost": 199.99, "score": 4, "emoji": "🍽️"},
    {"name": "Cooking Equipment", "desc": "Professional kitchen knife set", "cost": 299.99, "score": 5, "emoji": "🔪"},
    {"name": "Wine Collection", "desc": "Premium wine starter collection", "cost": 799.99, "score": 12, "emoji": "🍾"},
    
    # Home Improvement (Medium-High Cost)
    {"name": "Smart Home Kit", "desc": "Complete home automation system", "cost": 1499.99, "score": 25, "emoji": "🏠"},
    {"name": "Kitchen Renovation", "desc": "Complete kitchen makeover", "cost": 19999.99, "score": 120, "emoji": "🔨"},
    {"name": "Solar Panels", "desc": "Residential solar energy system", "cost": 14999.99, "score": 100, "emoji": "☀️"},
    {"name": "Swimming Pool", "desc": "Backyard swimming pool installation", "cost": 34999.99, "score": 180, "emoji": "🏊"},
    
    # Luxury Items (High Cost)
    {"name": "Designer Watch", "desc": "Swiss luxury timepiece", "cost": 4999.99, "score": 60, "emoji": "⌚"},
    {"name": "Jewelry Set", "desc": "Diamond and gold jewelry collection", "cost": 9999.99, "score": 90, "emoji": "💎"},
    {"name": "Art Piece", "desc": "Original artwork from known artist", "cost": 14999.99, "score": 110, "emoji": "🖼️"},
    {"name": "Luxury Vacation", "desc": "2-week luxury resort package", "cost": 19999.99, "score": 130, "emoji": "🏝️"},
    {"name": "Private Chef", "desc": "Personal chef service for 6 months", "cost": 24999.99, "score": 150, "emoji": "👨‍🍳"},
    {"name": "Yacht Charter", "desc": "Week-long luxury yacht charter", "cost": 49999.99, "score": 220, "emoji": "🛥️"},
    
    # Investment & Assets (Very High Cost)
    {"name": "Real Estate", "desc": "Investment property purchase", "cost": 99999.99, "score": 350, "emoji": "🏘️"},
    {"name": "Startup Investment", "desc": "Angel investment in tech startup", "cost": 149999.99, "score": 400, "emoji": "💼"},
    {"name": "Franchise", "desc": "Fast-food franchise ownership", "cost": 199999.99, "score": 450, "emoji": "🍔"},
    {"name": "Luxury Home", "desc": "High-end residential property", "cost": 499999.99, "score": 800, "emoji": "🏛️"},
    {"name": "Commercial Property", "desc": "Office building investment", "cost": 999999.99, "score": 1200, "emoji": "🏢"},
    
    # Subscriptions & Services (Low Cost)
    {"name": "Streaming Service", "desc": "Annual premium streaming subscription", "cost": 149.99, "score": 3, "emoji": "📺"},
    {"name": "Gym Membership", "desc": "1-year premium gym membership", "cost": 599.99, "score": 10, "emoji": "💪"},
    {"name": "Cloud Storage", "desc": "Unlimited cloud storage service", "cost": 99.99, "score": 2, "emoji": "☁️"},
    {"name": "VPN Service", "desc": "Premium VPN annual subscription", "cost": 79.99, "score": 2, "emoji": "🔐"},
    {"name": "Meal Delivery", "desc": "Gourmet meal delivery service", "cost": 199.99, "score": 4, "emoji": "🍱"},
]

print(f"[*] Inserting {len(items)} realistic community shop items...")
for item in items:
    shop_item = CommunityShop(
        name=item["name"],
        description=item["desc"],
        cost=item["cost"],
        score_value=item["score"],
        emoji=item["emoji"],
        available=True
    )
    session.add(shop_item)

session.commit()
print(f"[✔] Successfully inserted {len(items)} items into community_shop.")
print("[*] Items range from $24.99 to $999,999.99 with scores from 1 to 1200 points.")
session.close()