# LokAI Frontend

React-based frontend for LokAI - AI for Smarter Cities complaint management system.

## 🚀 Features

- **React 18**: Modern React with hooks and concurrent features
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **React Router**: Client-side routing for SPA navigation
- **Axios**: HTTP client with interceptors for API communication
- **Leaflet Maps**: Interactive geographic visualization
- **Chart.js**: Data visualization with react-chartjs-2
- **Lucide Icons**: Beautiful, consistent icon set
- **Mobile-First Design**: Responsive layout optimized for all devices

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html          # HTML template
│   └── favicon.ico         # Favicon
├── src/
│   ├── pages/
│   │   ├── SubmitComplaint.jsx  # Citizen complaint submission
│   │   ├── VerifyOtp.jsx         # OTP verification page
│   │   ├── Dashboard.jsx         # Admin dashboard
│   │   └── Heatmap.jsx           # Geographic heatmap
│   ├── components/
│   │   ├── Navbar.jsx            # Navigation component
│   │   ├── ComplaintCard.jsx     # Complaint display card
│   │   ├── StatsBox.jsx          # Statistics box component
│   │   └── Loader.jsx            # Loading spinner
│   ├── services/
│   │   └── api.js                # API client with axios
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # React entry point
│   ├── index.css                 # Global styles with Tailwind
│   └── App.css                   # App-specific styles
├── package.json            # Node.js dependencies
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md               # This file
```

## 🛠️ Installation

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or with yarn
   yarn install
   ```

3. **Start development server**
   ```bash
   npm start
   # or with yarn
   yarn start
   ```

The application will be available at `http://localhost:3000`

## 🎨 UI Components

### Pages

#### SubmitComplaint.jsx
- Multi-step complaint submission process
- OTP verification integration
- Geolocation support
- Form validation and error handling
- Success confirmation

#### VerifyOtp.jsx
- Dedicated OTP verification page
- Phone number validation
- Resend OTP functionality
- Navigation back to home

#### Dashboard.jsx
- Comprehensive analytics dashboard
- Real-time statistics
- Interactive charts and graphs
- Complaint management interface
- Filter and search capabilities

#### Heatmap.jsx
- Interactive geographic visualization
- Leaflet map integration
- Color-coded complaint density
- Category and status filtering
- Statistics sidebar

### Components

#### Navbar.jsx
- Responsive navigation
- Mobile menu support
- Active route highlighting
- Logo and branding

#### ComplaintCard.jsx
- Complaint display with metadata
- Status indicators
- Sentiment visualization
- Action buttons for status updates

#### StatsBox.jsx
- Statistical data display
- Trend indicators
- Icon integration
- Color-coded metrics

#### Loader.jsx
- Configurable loading spinner
- Multiple size options
- Custom text support

## 🌐 API Integration

### API Service (services/api.js)

#### Features
- Axios instance with base configuration
- Request/response interceptors
- Error handling utilities
- Service-specific API methods

#### Services

**OTP Service**
```javascript
otpService.sendOTP(phone)
otpService.verifyOTP(phone, otp)
otpService.getOTPStatus(phone)
```

**Complaint Service**
```javascript
complaintService.submitComplaint(data)
complaintService.getComplaints(filters)
complaintService.updateComplaint(id, data)
complaintService.searchComplaints(query)
```

**Dashboard Service**
```javascript
dashboardService.getSummary(days)
dashboardService.getHeatmapData(filters)
dashboardService.getPredictions()
dashboardService.getOverviewStats()
```

### Error Handling
- Global error interceptor
- User-friendly error messages
- Network error detection
- API response validation

## 🎨 Styling

### Tailwind CSS Configuration

#### Custom Theme
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      },
      secondary: {
        50: '#f0fdf4',
        500: '#22c55e',
        600: '#16a34a',
      }
    }
  }
}
```

#### Custom Components
```css
.btn-primary    /* Primary button styling */
.btn-secondary  /* Secondary button styling */
.input-field    /* Form input styling */
.card           /* Card component styling */
.spinner        /* Loading animation */
```

### Responsive Design
- Mobile-first approach
- Breakpoint-specific layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🗺️ Map Integration

### Leaflet Configuration
- OpenStreetMap tiles
- Custom marker styling
- Interactive popups
- Geographic clustering

### Heatmap Features
- Color-coded density visualization
- Category-based filtering
- Weight-based circle markers
- Interactive statistics

## 📊 Data Visualization

### Chart.js Integration
- Bar charts for category distribution
- Line charts for trend analysis
- Pie charts for status breakdown
- Custom color schemes

### Dashboard Analytics
- Real-time data updates
- Interactive filtering
- Performance metrics
- Predictive analytics display

## 🔧 Configuration

### Environment Variables
```env
REACT_APP_API_URL=http://localhost:8000
```

### Package.json Scripts
```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

## 🧪 Testing

### Run Tests
```bash
npm test
# or with yarn
yarn test
```

### Test Coverage
```bash
npm test -- --coverage
```

### Component Testing
- Jest for unit testing
- React Testing Library for component testing
- Mock API responses
- User interaction testing

## 🚀 Deployment

### Build for Production
```bash
npm run build
# or with yarn
yarn build
```

### Deployment Options

#### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `build/`
4. Set environment variables

#### Vercel
1. Import project
2. Auto-detect React app
3. Configure environment variables
4. Deploy automatically

#### AWS S3/CloudFront
1. Build application
2. Upload to S3 bucket
3. Configure CloudFront distribution
4. Set up custom domain

## 🔄 Development Workflow

### Code Style
- ESLint configuration
- Prettier formatting
- Component-based architecture
- Functional components with hooks

### State Management
- Local component state
- Custom hooks for API calls
- Context for global state (if needed)
- Error boundaries

### Performance Optimization
- Code splitting with React.lazy
- Image optimization
- Bundle size monitoring
- Lazy loading for routes

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Check backend is running
   - Verify API URL configuration
   - Check CORS settings

2. **Map Not Loading**
   - Verify Leaflet installation
   - Check network connectivity
   - Ensure valid coordinates

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check for dependency conflicts
   - Verify environment variables

4. **Styling Issues**
   - Check Tailwind CSS build
   - Verify PostCSS configuration
   - Clear browser cache

### Development Tips
- Use React DevTools for debugging
- Check Network tab for API calls
- Use browser responsive design tools
- Monitor console for errors

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Follow code style guidelines
4. Write tests for new components
5. Submit pull request

## 📚 Learning Resources

- [React Documentation](https://reactjs.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/docs)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Leaflet Documentation](https://leafletjs.com/reference.html)

## 📄 License

This project is licensed under the MIT License.
