# eSimphony - Next.js eSIM Management Platform

A modern, comprehensive mobile-first eSIM management platform built with **Next.js 14** and **TypeScript**. Enables users to purchase, activate, and manage eSIM plans across different countries and carriers with enhanced UX/UI patterns.

## 🌟 Features Overview

### **✅ Next.js Implementation (Current)**
- **Modern React Architecture**: Component-based design with TypeScript
- **Enhanced Demo System**: 7 comprehensive test accounts with different scenarios
- **Advanced Plan Selection**: Country/region search with Prepaid, Subscription, PAYG tabs
- **Improved Mobile UX**: Touch-optimized interactions and responsive design
- **Smart Preselection**: Intelligent plan selection based on user state
- **Bottom Navigation**: Consistent tab navigation across all screens
- **Component Reusability**: 90% code reduction from legacy HTML implementation

### **Core Features**
- **Multi-Account Support**: 7 different user profiles for comprehensive testing scenarios
- **Dynamic Plan Management**: Purchase, activate, and change eSIM plans with real-time updates
- **Smart Balance Management**: Context-aware top-up flows with balance validation
- **Plan Change Workflows**: Switch between active plans with confirmation modals
- **Destination Search**: Country and region selection with search functionality
- **Mobile-First Design**: Optimized for mobile devices with Tailwind CSS
- **Demo Reset System**: Complete localStorage clearing with visual feedback

## 🚀 Quick Start

### **Development Setup**
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

### **Testing Flows**
1. **Demo Accounts**: Visit `/demo-support` for 7 comprehensive test accounts
2. **Reset Data**: Use the demo reset functionality to clear all localStorage
3. **Multiple Scenarios**: Test different user journeys with pre-configured profiles

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

## 👥 Enhanced Demo Account System

### **7 Comprehensive Test Accounts**

Visit `/demo-support` for instant access to all demo accounts with one-click login functionality.

### 🔴 **1. Alex Chen (No Balance)**
```
Email: nobalance@esim.demo
Password: 123456
Balance: $0.00 | Plan: None
```
**Use Case**: New user with no balance and no active plans. Perfect for testing first-time user flows and top-up processes.

---

### 💰 **2. Sarah Johnson (Has Balance)**  
```
Email: exist-topup@esim.demo
Password: 123456
Balance: $25.00 | Plan: None
```
**Use Case**: User with existing balance but no active plans. Ideal for testing plan purchase flows without needing to top up first.

---

### 📱 **3. Michael Rodriguez (Active Plan)**
```
Email: exist-plan@esim.demo
Password: 123456
Balance: $45.00 | Plan: Euro Data Pass Active
```
**Use Case**: User with balance and an active plan. Perfect for testing plan management, plan changes, and renewal flows.

---

### 📶 **4. Emma Thompson (eSIM Available)**
```
Email: esim-available@esim.demo
Password: 123456
Balance: $35.00 | eSIM: Ready for activation
```
**Use Case**: User with eSIM ready for activation. Shows "Activate eSIM" section on home dashboard with activation button.

---

### 🌐 **5. David Kim (eSIM Active)**
```
Email: esim-active@esim.demo
Password: 123456
Balance: $52.00 | eSIM: Active with US Prepaid 10GB
```
**Use Case**: User with active eSIM and data usage. Displays usage statistics, data consumption, and expiration information.

---

### ❌ **6. Lisa Martinez (Activation Fails)**
```
Email: esim-fail@esim.demo
Password: 123456
Balance: $30.00 | eSIM: Available (Always fails activation)
```
**Use Case**: Test account that always fails automatic eSIM activation, forcing manual setup flow. Perfect for testing error handling.

---

### ✅ **7. Ryan Chang (Activation Success)**
```
Email: esim-success@esim.demo
Password: 123456
Balance: $40.00 | eSIM: Available (Always succeeds activation)
```
**Use Case**: Test account that always succeeds in automatic eSIM activation. Ideal for testing successful activation flow.

---

## 🛠️ Modern Technical Architecture

### **Frontend Stack**
- **Next.js 14**: React framework with App Router and TypeScript
- **React 18**: Modern hooks, context, and component patterns
- **TypeScript**: Type-safe development with full IDE support
- **Tailwind CSS**: Utility-first styling with custom design system
- **Lucide React**: Modern icon system replacing Font Awesome

### **Component Architecture**
- **AppLayout**: Unified layout with bottom navigation and top bar
- **Page Components**: Dashboard, Plans, Usage, Profile, Support, etc.
- **UI Components**: Reusable Button, Card, Input components
- **Layout Components**: BottomNavigation, TopNotificationBar
- **Demo System**: Enhanced DemoSupport with 7 test accounts

### **State Management**
- **localStorage Utilities**: Type-safe storage wrapper functions
- **React Context**: User profile and authentication state
- **Component State**: Local UI state with useState/useEffect
- **Navigation State**: Source tracking for complex user flows

### **Data Management**
- **Demo Data**: Comprehensive test accounts and plan configurations
- **Type Safety**: Full TypeScript interfaces for all data structures
- **State Persistence**: Cross-page data consistency with enhanced validation
- **Smart Preselection**: Context-aware plan selection logic

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

### **Project Structure**
```
esimphony/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/         # Main dashboard
│   │   ├── plans/            # Plan selection & management  
│   │   ├── top-up/           # Balance top-up flows
│   │   ├── usage/            # Usage tracking
│   │   ├── profile/          # User profile management
│   │   ├── demo-support/     # Enhanced demo system
│   │   └── layout.tsx        # Root layout
│   ├── components/           # Reusable React components
│   │   ├── ui/              # Basic UI components (Button, Card, Input)
│   │   ├── layout/          # Layout components (AppLayout, BottomNav)
│   │   └── [feature]/       # Feature-specific components
│   ├── lib/                 # Utilities and helpers
│   │   ├── utils.ts         # Common utilities and storage
│   │   └── demo-data.ts     # Demo accounts and plan data
│   └── types/               # TypeScript type definitions
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind CSS configuration
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
└── README.md               # This documentation
```

---

## 🚨 Reset & Debugging

### **Reset Application State**
Visit `/demo-support` and use the reset functionality to completely clear all cached data:
- Clears all localStorage keys with confirmation
- Visual feedback with loading states
- Redirects to welcome screen automatically
- Enhanced reset process with better UX

### **Debug Information**
Check browser console for:
- localStorage state logging
- Navigation source tracking
- Account type identification
- Balance/plan state changes

### **Common Issues**
- **Stuck in login loop**: Visit `/demo-support` and use reset functionality
- **Balance not updating**: Check localStorage in developer tools
- **Plans not showing**: Verify account type and authentication state
- **Navigation issues**: Use demo reset or clear browser cache

---

## ✅ Next.js Migration Completed

### **Migration Success**

**Achieved Benefits:**
- **✅ 90% code reduction** through component reuse and modern architecture
- **✅ TypeScript integration** for type-safe development experience
- **✅ Enhanced mobile UX** with improved touch interactions and responsive design
- **✅ Modern React patterns** with hooks, context, and App Router
- **✅ Component-based architecture** eliminating code duplication
- **✅ Enhanced demo system** with 7 comprehensive test accounts

**Technical Improvements:**
- **Component Library**: Reusable UI components (Button, Card, Input)
- **Layout System**: Unified AppLayout with consistent navigation
- **State Management**: Type-safe localStorage utilities and React context
- **Enhanced Features**: Smart plan preselection, improved search functionality
- **Better UX**: Mobile-optimized interactions, clear visual feedback

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