# ZUS Retirement Simulator (Frontend)

This is the frontend for the ZUS Retirement Simulator, a 24-hour project for the HackYeah 2025 hackathon. We're building a simple, educational web tool to help people in Poland forecast their future pension.

---

## Tech Stack

- **Framework**: Angular
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Phosphor Icons

---

## Key Features

### Initial View

- An input for the user's desired pension amount.
- A chart showing average pensions with hover-over details for different groups.
- A component that displays a random "did you know?" fact about pensions.

### Simulation Form

- Inputs for age, sex, gross salary, and start/end work years.
- Optional inputs for funds already accumulated in ZUS and a toggle to factor in sick leave[cite: 50, 51].

### Results Page

- Shows the final forecast as both an _actual_ amount and a _real_ (inflation-adjusted) amount[cite: 58, 59, 60].
- Compares the user's forecast to the projected average and shows their replacement rate[cite: 61].
- [cite\_start]Calculates how the pension would increase if retirement is delayed by 1, 2, or 5 years[cite: 62, 63].
- [cite\_start]If the forecast is below the user's goal, it shows how much longer they'd need to work[cite: 65].

### Advanced Dashboard

- [cite\_start]Allows users to input specific historical salaries or different future raises[cite: 68].
- [cite\_start]Lets users add specific periods of illness (past and future) to the calculation[cite: 69].
- [cite\_start]Includes a chart visualizing how ZUS funds grow over time[cite: 70].
- [cite\_start]A "Download Report" button for a full summary of the simulation[cite: 74].

---

## Design & Accessibility

[cite\_start]The UI must follow the **ZUS Brand Book** color palette and be fully **WCAG 2.0 compliant**[cite: 18, 31].

- [cite\_start]`rgb(255, 179, 79)` [cite: 19]
- [cite\_start]`rgb(0, 153, 63)` [cite: 21]
- #185b3a
- [cite\_start]`rgb(190, 195, 206)` [cite: 23]
- [cite\_start]`rgb(63, 132, 210)` [cite: 25]
- [cite\_start]`rgb(0, 65, 110)` [cite: 27]
- [cite\_start]`rgb(240, 94, 94)` [cite: 29]
- [cite\_start]`rgb(0, 0, 0)` [cite: 30]

---

## Development

1.  **Clone & Install**
    Clone the repo, navigate into the directory, and install dependencies.

    ```sh
    npm install
    ```

2.  **Run the Dev Server**
    This will start a local server, usually at `http://localhost:4200/`.

    ```sh
    ng serve
    ```

### Other Commands

- `ng build`: Builds the project for production.
- `ng test`: Runs the unit tests.
