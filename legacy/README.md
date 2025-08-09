# eSimphony - eSIM Management Platform

A comprehensive mobile-first eSIM management platform that enables users to purchase, activate, and manage eSIM plans across different countries and carriers.

## 🌟 Features Overview

- **Multi-Account Support**: Different user profiles for comprehensive testing
- **Plan Management**: Purchase, activate, and change eSIM plans  
- **Balance Management**: Top-up account balance with Stripe integration
- **Plan Change Flow**: Switch between active plans with confirmations
- **Responsive Design**: Mobile-first approach with Bootstrap 5.3.7
- **Demo Reset**: Clean slate functionality for testing scenarios

## 🚀 Quick Start

1. **Welcome Screen**: Open `index.html` to start
2. **Reset Data**: Visit `/reset.html` to clear all localStorage
3. **Demo Accounts**: Use predefined accounts for testing different flows

## 📱 Use Case Flows

### **Use Case 1: New Customer Onboarding**
*Complete journey from registration to eSIM activation*

**Flow Path:**
```
Welcome Screen → Register → Dashboard → Plans → Tariff Details → Top-Up → eSIM Activation
```

**Purpose**: Test the complete new customer experience
- User creates account with zero balance
- Discovers and selects plans
- Handles insufficient balance scenario
- Completes payment and activates eSIM

**Test Account**: 
- Register any new account OR
- Use `nobalance@esim.demo` (password: 123456)

---

### **Use Case 2: Existing Customer Top-Up**
*Direct balance top-up for existing customers*

**Flow Path:**
```
Dashboard → Top-Up → Success → Return to Dashboard
```

**Purpose**: Test quick balance addition workflow
- User has existing account
- Direct top-up from dashboard
- Balance updates immediately
- Returns to dashboard after success

**Test Account**: `exist-topup@esim.demo` (password: 123456)
- Profile: Sarah
- Initial Balance: $25.00
- Status: No active plan

---

### **Use Case 3: Plan Change Management**
*Change or upgrade existing active plans*

**Flow Path:**
```
Dashboard → Change Plan → Tariff Details → Plan Selection → Modal Confirmation → Success
```

**Alternative Flows:**
- **Early Prepaid Switch**: Warning modal → Confirmation
- **Insufficient Balance**: Redirect to Top-Up → Return to Plan Change

**Purpose**: Test plan management capabilities
- User has active plan with remaining data
- Wants to switch to different plan
- Handles data loss warnings
- Manages plan upgrades/downgrades

**Test Account**: `exist-plan@esim.demo` (password: 123456)
- Profile: Michael  
- Balance: $45.00
- Active Plan: Euro Data Pass (20GB, 8.5GB used, 18 days left)

---

## 👥 Demo Account Profiles

### 🔴 **No Balance Account**
```
Email: nobalance@esim.demo
Password: 123456
Profile: Alex
Balance: $0.00
Plan: None
Account Type: no-balance
```

**UI Features:**
- ⚠️ Warning border on balance card
- 🔄 Pulsing top-up button animation
- 📋 "Choose Your First Plan" section
- 🎯 Encourages immediate top-up

**Testing Purpose:**
- New customer scenarios
- Zero balance workflows  
- First-time plan purchase
- Payment requirement flows

---

### 💰 **Balance Available Account**
```
Email: exist-topup@esim.demo
Password: 123456
Profile: Sarah
Balance: $25.00
Plan: None  
Account Type: has-balance
```

**UI Features:**
- 💰 Clean UI with available balance
- 📋 "Choose Your First Plan" section
- 🛒 Ready for immediate plan purchase
- ✅ Sufficient funds for most plans

**Testing Purpose:**
- Direct plan purchase flows
- Balance utilization scenarios
- First plan activation
- Skip top-up workflows

---

### 📱 **Active Plan Account**
```
Email: exist-plan@esim.demo
Password: 123456
Profile: Michael
Balance: $45.00
Plan: Euro Data Pass (20GB)
Account Type: has-plan
```

**Plan Details:**
- **Data Usage**: 8.5GB / 20GB (42.5% used)
- **Remaining**: 11.5GB
- **Expiry**: 18 days
- **Renewal Price**: $25.00

**UI Features:**
- 📱 Active plan card with usage visualization
- 📊 Progress bar for data consumption
- 📅 Expiration countdown
- 💰 Higher balance for plan changes
- 🔄 "Change Plan" button

**Testing Purpose:**
- Plan management workflows
- Plan change scenarios
- Data usage visualization
- Renewal/upgrade flows
- All Use Cases 1-3 compatibility

---

### 🆕 **New Registration Account**
```
Create via Register Form
Profile: [User Input]
Balance: $0.00 (always)
Plan: None (always)
Account Type: new
```

**Features:**
- 🆕 Clean slate experience
- 🔄 Pulsing UI if zero balance
- 📋 First plan selection flow
- 🎯 New customer onboarding path

**Testing Purpose:**
- Registration workflow testing
- Fresh user experience
- Zero balance scenarios
- Clean state validation

---

## 🛠️ Technical Architecture

### **Frontend Stack**
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom properties, Grid, Flexbox, animations
- **Bootstrap 5.3.7**: Responsive components and utilities
- **Vanilla JavaScript**: ES6+ with localStorage management
- **Inter Font**: Professional typography system

### **Data Management**
- **localStorage**: User profiles, balance, plans, navigation state
- **Profile System**: Account-specific data loading
- **State Persistence**: Cross-page data consistency
- **Demo Reset**: Complete data clearing functionality

### **Navigation System**
- **Source Tracking**: Flow-aware navigation
- **Context Awareness**: Different behaviors based on user journey
- **Fallback Handling**: Graceful error recovery
- **Deep Linking**: URL parameter support

---

## 🎨 Design System

### **Color Palette**
```css
--esimphony-black: #000000    /* Primary background */
--esimphony-white: #FFFFFF    /* Text and cards */
--esimphony-red: #FF0000      /* Primary actions */
--esimphony-gray: #666666     /* Secondary text */
--esimphony-success: #00D26A  /* Success states */
--esimphony-warning: #FFA500  /* Warning states */
```

### **Typography**
- **Primary Font**: Inter (Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold)
- **Responsive Scaling**: Fluid typography across devices

### **UI Components**
- **Cards**: Rounded corners (16px), subtle shadows
- **Buttons**: Consistent padding, hover states, loading animations
- **Forms**: Floating labels, validation states, accessibility focus
- **Modals**: Centered dialogs with backdrop blur

---

## 📊 Navigation Flows

### **Flow Matrix**
| Start Screen | Account Type | Destination | Use Case |
|--------------|-------------|-------------|----------|
| Welcome | Any | Register/Login | Entry Point |
| Dashboard | No Balance | Plans → Top-up | UC1 |
| Dashboard | Has Balance | Plans → Direct Purchase | UC1 |
| Dashboard | Any | Top-up → Dashboard | UC2 |
| Dashboard | Has Plan | Change Plan → Confirmation | UC3 |
| Reset | Any | Welcome | Cleanup |

### **State Management**
```javascript
// User Profile Structure
{
  firstName: "string",
  email: "string", 
  balance: "decimal",
  activePlan: "object|null",
  accountType: "no-balance|has-balance|has-plan|new|regular"
}

// Navigation Sources
{
  topUpSource: "home-dashboard|tariff-details-balance|tariff-details-change",
  planChangeSource: "home-dashboard",
  planChangeData: "object|null"
}
```

---

## 🧪 Testing Scenarios

### **Scenario 1: Zero to Hero (Complete Journey)**
1. Start at `/reset.html` to clear data
2. Register new account via welcome screen
3. Navigate to plans with $0.00 balance
4. Experience insufficient balance flow
5. Complete top-up and return to plan selection
6. Purchase and activate first eSIM
7. Test activation success/QR code flows

### **Scenario 2: Quick Top-Up**
1. Login with `exist-topup@esim.demo`
2. Click "Top-Up Balance" from dashboard
3. Add $15.00 to existing $25.00 balance
4. Verify balance updates to $40.00
5. Return to dashboard automatically

### **Scenario 3: Plan Management**
1. Login with `exist-plan@esim.demo`
2. View active plan details (Euro Data Pass)
3. Click "Change Plan" button
4. Select new prepaid plan (triggers warning)
5. Confirm switch through warning modal
6. Complete plan change process
7. Verify new plan activation

### **Scenario 4: Insufficient Balance Plan Change**
1. Login with `exist-topup@esim.demo` 
2. Navigate to plans and select expensive plan ($40+)
3. Try to change plan with insufficient balance ($25)
4. Get redirected to top-up screen
5. Add required funds
6. Return to plan selection automatically
7. Complete plan change with sufficient balance

---

## 🔧 Development Setup

### **Local Development**
```bash
# Clone repository
git clone [repository-url]
cd esimphony

# Serve locally (any HTTP server)
python -m http.server 8000
# OR
npx serve .
# OR  
php -S localhost:8000
```

### **File Structure**
```
esimphony/
├── index.html              # Welcome screen
├── login.html              # Login with demo accounts
├── register.html           # New user registration
├── home-dashboard.html     # Main dashboard
├── tariff-details.html     # Plan selection & management
├── top-up.html            # Balance top-up with Stripe
├── activate-esim.html     # eSIM activation flow
├── reset.html             # Demo reset functionality
└── README.md              # This documentation
```

---

## 🚨 Reset & Debugging

### **Reset Application State**
Visit `/reset.html` to completely clear all cached data:
- Clears all localStorage keys
- Shows progress visualization  
- Redirects to welcome screen
- Includes cancel option

### **Debug Information**
Check browser console for:
- localStorage state logging
- Navigation source tracking
- Account type identification
- Balance/plan state changes

### **Common Issues**
- **Stuck in login loop**: Visit `/reset.html`
- **Balance not updating**: Check localStorage manually
- **Plans not showing**: Verify account type in console
- **Navigation issues**: Clear browser cache + localStorage

---

## 🔄 Architecture Evolution

### **Next.js Migration Plan**

The current static HTML architecture will be migrated to **Next.js 14+** to improve maintainability and scalability:

**Current State:**
- 15 static HTML files with inline CSS
- ~15,000 lines of duplicated code
- Manual navigation and state management

**Next.js Benefits:**
- **90% code reduction** through component reuse
- **TypeScript** for better development experience
- **Server-side rendering** for improved performance
- **Modern React features** (hooks, context, routing)
- **Component-based architecture** eliminating duplication

**Migration Timeline:**
- **Phase 1**: Project setup & Tailwind CSS integration (1-2 days)
- **Phase 2**: Component library & layout system (2-3 days)  
- **Phase 3**: Page migration & state management (3-4 days)
- **Phase 4**: Enhanced features & API routes (2-3 days)
- **Phase 5**: Testing & deployment (1-2 days)

**Total Duration: 9-14 days**

📋 *Detailed migration plan: `/prompts/use-case-8-nextjs-now/switching-nextjs-planning.md`*

---

## 📈 Features Roadmap

### **Implemented ✅**
- Multi-account demo system
- Complete use case flows (1-3)
- Plan change with modals
- Balance management
- Responsive design
- Reset functionality

### **In Planning 🎯**
- **Next.js Migration**: Modern React architecture
- **TypeScript Integration**: Type-safe development
- **Component Library**: Reusable UI components
- **State Management**: Context/Zustand implementation

### **Future Enhancements 🚧**
- Real eSIM carrier integration
- Multiple country support
- Usage analytics dashboard
- Push notifications
- Offline mode support
- Advanced plan filtering

---

## 🤝 Contributing

This is a demo application showcasing eSIM management workflows. The focus is on UX/UI patterns and user journey optimization rather than backend integration.

### **Key Design Principles**
1. **Mobile-First**: All screens optimized for mobile devices
2. **Progressive Enhancement**: Graceful fallbacks for all features  
3. **Accessibility**: WCAG compliant with keyboard navigation
4. **Performance**: Minimal dependencies, optimized assets
5. **User-Centric**: Clear feedback, intuitive workflows

---

## 📄 License

This project is a demonstration of eSIM management platform capabilities and user experience patterns.

---

*Last Updated: August 2025*
*Version: 4.0 - Multi-Account Flows*