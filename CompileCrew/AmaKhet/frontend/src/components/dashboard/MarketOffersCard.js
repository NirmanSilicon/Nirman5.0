import React from 'react';
import { motion } from 'framer-motion';
import { FaHandshake, FaMapMarkerAlt, FaRupeeSign, FaPhone, FaEnvelope, FaStar } from 'react-icons/fa';
import { useLanguage } from '../../contexts/LanguageContext';
import './DashboardCard.css';

const MarketOffersCard = ({ crop = 'rice' }) => {
  const { t } = useLanguage();
  // Bhubaneswar, Odisha specific market offers data
  const marketOffersData = {
    crop: crop,
    lastUpdated: '2 hours ago',
    location: 'Bhubaneswar, Odisha',
    offers: [
      {
        id: 1,
        buyer: 'Odisha State Cooperative Marketing Federation (MARKFED)',
        location: 'Bhubaneswar, Odisha',
        price: 42,
        unit: 'per kg',
        quantity: '10000 kg',
        quality: 'Grade A',
        delivery: 'Ex-farm',
        rating: 4.7,
        verified: true,
        contact: {
          phone: '+91 674 253 4567',
          email: 'procurement@markfedodisha.org'
        },
        offerValid: '15 days',
        specialTerms: 'Government guaranteed payment within 7 days',
        highlights: [
          'Government-backed procurement with guaranteed payment',
          'No quality rejection issues',
          'Transportation support from farm to mandi',
          'Minimum Support Price (MSP) guaranteed'
        ]
      },
      {
        id: 2,
        buyer: 'Eastern India Rice Mills Association',
        location: 'Cuttack, Odisha',
        price: 45,
        unit: 'per kg',
        quantity: '8000 kg',
        quality: 'Grade A/B',
        delivery: 'Ex-farm',
        rating: 4.5,
        verified: true,
        contact: {
          phone: '+91 671 234 5678',
          email: 'rice@easternmills.in'
        },
        offerValid: '10 days',
        specialTerms: 'Weekly payment cycle with advance payment option',
        highlights: [
          'Local rice mill with 20+ years experience',
          'Direct farmer-to-mill supply chain',
          'Quality testing at farm gate',
          'Flexible payment terms available'
        ]
      },
      {
        id: 3,
        buyer: 'Bhubaneswar Organic Farmers Cooperative',
        location: 'Bhubaneswar, Odisha',
        price: 52,
        unit: 'per kg',
        quantity: '5000 kg',
        quality: 'Organic Certified Only',
        delivery: 'Ex-farm',
        rating: 4.9,
        verified: true,
        contact: {
          phone: '+91 94370 12345',
          email: 'organic@bhubaneswarcoop.org'
        },
        offerValid: '20 days',
        specialTerms: 'Organic certification required, premium price for quality',
        highlights: [
          'Highest price for organic rice in Odisha',
          'Direct export opportunities to European markets',
          'Technical support for organic farming practices',
          'Long-term contract with price escalation clause'
        ]
      },
      {
        id: 4,
        buyer: 'Puri District Agricultural Marketing Society',
        location: 'Puri, Odisha',
        price: 40,
        unit: 'per kg',
        quantity: '6000 kg',
        quality: 'Grade A',
        delivery: 'Ex-farm',
        rating: 4.3,
        verified: true,
        contact: {
          phone: '+91 6752 345 678',
          email: 'marketing@puriagrisociety.org'
        },
        offerValid: '12 days',
        specialTerms: 'Bulk purchase discount for 5000+ kg',
        highlights: [
          'Local cooperative with strong farmer network',
          'Immediate payment on delivery',
          'Storage facility available for delayed pickup',
          'Insurance coverage for crop damage during transport'
        ]
      },
      {
        id: 5,
        buyer: 'Bhubaneswar Urban Consumers Cooperative',
        location: 'Bhubaneswar, Odisha',
        price: 48,
        unit: 'per kg',
        quantity: '3000 kg',
        quality: 'Grade A',
        delivery: 'Ex-farm',
        rating: 4.6,
        verified: true,
        contact: {
          phone: '+91 674 456 7890',
          email: 'urban@bhubaneswarcoop.com'
        },
        offerValid: '8 days',
        specialTerms: 'Direct consumer supply with premium pricing',
        highlights: [
          'Direct supply to urban consumers',
          'Premium price for fresh produce',
          'Regular weekly orders available',
          'No middleman commission'
        ]
      }
    ],
    marketInsights: [
      'Odisha rice market showing strong demand with 12% price increase this season',
      'Organic rice fetching 25-30% premium over conventional rice',
      'Government MSP for rice is ₹40/kg, direct buyers offering ₹42-52/kg',
      'Monsoon season affecting supply, prices expected to rise further',
      'Local cooperatives offering better prices than distant buyers',
      'Export demand from Bangladesh and Nepal driving prices up',
      'Consider selling in smaller batches for better price realization'
    ]
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star half-filled" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
    }
    
    return stars;
  };

  return (
    <motion.div
      className="dashboard-card market-offers-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-header">
        <div className="card-title">
          <FaHandshake className="card-icon" />
          <h1>{t('cards.marketOffers')}</h1>
        </div>
        <div className="last-updated">
          <span><strong>Updated: {marketOffersData.lastUpdated}</strong></span>
        </div>
      </div>

      <div className="card-content">
        {/* Market Overview */}
        <div className="market-overview">
          <h4>Direct Buyer Offers for {marketOffersData.crop.charAt(0).toUpperCase() + marketOffersData.crop.slice(1)} in {marketOffersData.location}</h4>
          <p className="market-subtitle">Local buyers offering competitive prices for {marketOffersData.crop} in Bhubaneswar, Odisha</p>
          <div className="crop-type-badge">
            <span className="crop-label">Crop Type:</span>
            <span className="crop-name">{marketOffersData.crop.charAt(0).toUpperCase() + marketOffersData.crop.slice(1)}</span>
          </div>
        </div>

        {/* Offers List */}
        <div className="offers-list">
          {marketOffersData.offers.map((offer, index) => (
            <div key={offer.id} className="offer-item">
              <div className="offer-header">
                <div className="buyer-info">
                  <div className="buyer-name">
                    {offer.buyer}
                    {offer.verified && <span className="verified-badge">✓ Verified</span>}
                  </div>
                  <div className="buyer-location">
                    <FaMapMarkerAlt className="location-icon" />
                    {offer.location}
                  </div>
                </div>
                <div className="offer-rating">
                  <div className="stars">{getRatingStars(offer.rating)}</div>
                  <div className="rating-value">{offer.rating}</div>
                </div>
              </div>

              <div className="offer-details">
                <div className="offer-price-section">
                  <div className="offer-price">
                    <FaRupeeSign className="rupee-icon" />
                    <span className="price-number">{offer.price}</span>
                    <span className="price-unit">/{offer.unit}</span>
                  </div>
                  <div className="offer-quantity">
                    Quantity: <strong>{offer.quantity}</strong>
                  </div>
                </div>

                <div className="offer-specs">
                  <div className="spec-item">
                    <span className="spec-label">Crop:</span>
                    <span className="spec-value">{marketOffersData.crop.charAt(0).toUpperCase() + marketOffersData.crop.slice(1)}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Quality:</span>
                    <span className="spec-value">{offer.quality}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Delivery:</span>
                    <span className="spec-value">{offer.delivery}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Valid for:</span>
                    <span className="spec-value">{offer.offerValid}</span>
                  </div>
                </div>

                <div className="offer-highlights">
                  <h5>Highlights:</h5>
                  <ul>
                    {offer.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>

                <div className="offer-terms">
                  <div className="special-terms">
                    <strong>Special Terms:</strong> {offer.specialTerms}
                  </div>
                </div>

                <div className="offer-contact">
                  <div className="contact-info">
                    <div className="contact-item">
                      <FaPhone className="contact-icon" />
                      <span>{offer.contact.phone}</span>
                    </div>
                    <div className="contact-item">
                      <FaEnvelope className="contact-icon" />
                      <span>{offer.contact.email}</span>
                    </div>
                  </div>
                  <button className="contact-buyer-btn">{t('market.contactBuyer')}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Market Insights */}
        <div className="market-insights">
          <h4>Market Insights & Recommendations:</h4>
          <ul>
            {marketOffersData.marketInsights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketOffersCard;
