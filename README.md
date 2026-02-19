# SmartTaskHub 🚀

A modern, all-in-one productivity application built with Angular 19. SmartTaskHub helps you manage tasks, track daily habits, and analyze your productivity with beautiful analytics and insights.

## ✨ Features

### 📋 Task Management
- Create, organize, and track tasks with priorities (High, Medium, Low)
- Mark tasks as completed (tasks are automatically removed when completed)
- View only in-progress tasks for better focus
- Real-time statistics showing total and in-progress tasks

### ✅ Habit Tracker
- Track daily habits: Water Intake, Exercise, and Reading
- Set custom targets for each habit
- Input validation to prevent negative values and values exceeding targets
- View habit progress with visual progress bars
- Select any date to view historical habit data

### 📊 Analytics & Insights
- Comprehensive task analytics:
  - Total, completed, and in-progress task counts
  - Completion rate percentage
  - Priority breakdown (High/Medium/Low) with completion statistics
- Detailed habit analytics:
  - Days tracked
  - Average water intake, exercise, and reading
  - Monthly averages for all habits
- Beautiful visualizations with progress bars and stat cards

### 🎨 Reusable Components
- **Button Component**: Primary/secondary styles with multiple sizes
- **Card Component**: Flexible card layout with optional title and badge
- **Stat Card Component**: Display statistics with icons and colors
- **Progress Bar Component**: Visual progress indicators

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── assets/
│   │   └── data/          # JSON data files (tasks.json, habits.json)
│   ├── components/         # Reusable UI components
│   │   ├── button/
│   │   ├── card/
│   │   ├── progress-bar/
│   │   └── stat-card/
│   ├── models/             # TypeScript interfaces
│   ├── pages/              # Main application pages
│   │   ├── home/
│   │   ├── dashboard/
│   │   └── analytics/
│   ├── services/           # Data service for managing JSON data
│   └── styles.css          # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI 19.1.7

### Installation

1. Clone the repository:
```bash
git clone https://github.com/thetaxas2468/SmartTaskHub.git
cd SmartTaskHub/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200/`

## 📝 Usage

### Adding Tasks
1. Navigate to the Dashboard
2. Click "Add Task" in Quick Actions
3. Enter task title and select priority
4. Click "Add Task" to save

### Tracking Habits
1. Navigate to the Dashboard
2. Click "Track Habit" in Quick Actions
3. Enter values for Water Intake (liters), Exercise (minutes), and Reading (minutes)
4. Values are validated automatically (no negatives, cannot exceed targets)
5. Click "Save Habits" to record for today's date

### Viewing Analytics
1. Click "Analytics & Insights" from the home page
2. View comprehensive statistics about your tasks and habits
3. See monthly averages and completion rates

## 🗄️ Data Storage

The application uses:
- **JSON Files**: Initial data stored in `src/assets/data/` (tasks.json, habits.json)
- **LocalStorage**: All changes are persisted in browser's localStorage
- **Data Service**: Centralized service for managing data operations

## 🛠️ Technologies Used

- **Angular 19**: Modern Angular framework with standalone components
- **TypeScript**: Type-safe JavaScript
- **RxJS**: Reactive programming for data streams
- **CSS Variables**: Modern styling with CSS custom properties

## 📦 Key Components

### Data Service (`data.service.ts`)
- Manages tasks and habits data
- Handles localStorage persistence
- Provides observables for reactive updates
- Exports data to JSON format

### Pages
- **Home**: Landing page with feature overview and statistics
- **Dashboard**: Main workspace for tasks and habits
- **Analytics**: Detailed productivity insights

## 🔄 Angular Version Notes

This project includes comments showing Angular v17+ syntax for:
- `@if` instead of `*ngIf`
- `@for` instead of `*ngFor`
- `input()` instead of `@Input()`
- `output()` instead of `@Output()`

## 🚧 Development

### Building for Production
```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

### Running Tests
```bash
ng test
```

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

Built with ❤️ using Angular 19
