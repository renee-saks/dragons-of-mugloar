# Dragons of Mugloar

A strategic browser game implementation of the [Dragons of Mugloar](https://www.dragonsofmugloar.com/) challenge, using Angular 19.1 with Material UI and NgRx Signals.

## Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
npm install
```

### Development

```bash
npm run start
```

Navigate to `http://localhost:4200/`. The application automatically reloads on source changes.

### Code Quality

```bash
npm run fix # Fixes formatting, linting, and style issues
```

## Game Mechanics

### Task Probability Levels

Listed from highest to lowest success chance:

1. `Sure thing`
2. `Piece of cake`
3. `Walk in the park`
4. `Quite likely`
5. `Hmmm....`
6. `Gamble`
7. `Risky`
8. `Rather detrimental`
9. `Playing with fire`
10. `Suicide mission`
11. `Impossible`

### Encryption System

Tasks may use two encryption methods:

| Encryption Level | Method         | Affected Fields                  |
| ---------------- | -------------- | -------------------------------- |
| `1`              | Base64 (UTF-8) | `adId`, `message`, `probability` |
| `2`              | ROT13          | `adId`, `message`, `probability` |

#### Examples

Base64 (encrypted: 1):

```json
{
  "adId": "TDRPYUxpdDM=", // Decodes to: "L4OaLit3"
  "message": "SW52ZXN0aWdhdGU=", // Decodes to: "Investigate"
  "probability": "UGxheWluZyB3aXRoIGZpcmU=" // Decodes to: "Playing with fire"
}
```

ROT13 (encrypted: 2):

```json
{
  "adId": "0u1lohr9", // Decodes to: "0h1ybue9"
  "message": "Xvyy Funagn", // Decodes to: "Kill Shanta"
  "probability": "Fhvpvqr zvffvba" // Decodes to: "Suicide mission"
}
```

### Reputation System

- Investigating reputation costs one turn (can be done indefinitely)
- Maintaining a balance between reputations is key to survival

#### People Reputation

- **Positive Actions**: Tasks with `create`, `escort`, or `help`
- Must stay positive to continue playing

#### State Reputation

- **Negative Actions**: Tasks with `kill` or `steal`
- Negative reputation triggers trap tasks
- Low reputation attracts underworld tasks

#### Underworld Reputation

- **Negative Actions**: Completing encrypted tasks (level 1 or 2)

### Shop System

- Each purchase costs one turn (successful or not)
- **Feature**: Implemented bulk buying functionality (purchase multiple items simultaneously, each still costing one turn)

#### Available Items

| ID         | Name                     | Cost | Impact    |
| ---------- | ------------------------ | ---- | --------- |
| hpot       | Healing Potion           | 50   | +1 life   |
| cs         | Claw Sharpening          | 100  | +1 level  |
| gas        | Gasoline                 | 100  | +1 life   |
| wax        | Copper Plating           | 100  | +1 level  |
| tricks     | Book of Tricks           | 100  | +1 level  |
| wingpot    | Potion of Stronger Wings | 100  | +1 level  |
| ch         | Claw Honing              | 300  | +2 levels |
| rf         | Rocket Fuel              | 300  | +2 levels |
| iron       | Iron Plating             | 300  | +2 levels |
| mtrix      | Book of Megatricks       | 300  | +2 levels |
| wingpotmax | Potion of Awesome Wings  | 300  | +2 levels |

### Special Tasks

#### Defensive Tasks

- Contain `help defending`
- Neutral reputation impact
- Appear at low underworld reputation
- Success chance decreases over time
- Eventually become impossible

#### Diamond Trap Tasks

- Contain `super awesome diamond`
- Always fail despite showing highest probability
- Appear at low state reputation

## History Tracking

Feature implemented to track completed tasks, shop purchases, and game progression and show them in a visual way to the user.

## Autoplay System

### Core Features

- **Game Loop**: Continuously evaluates and executes optimal actions
- **Task Selection**: Risk/reward optimization algorithm
- **Health Management**: Auto-purchases healing potions when:
  - Lives < 5
  - Gold ≥ potion cost
- **Progression**: Invests remaining gold in character upgrades

## Development Roadmap

1. Enhanced Task Selection

   - Advanced difficulty assessment
   - Reputation impact analysis
   - Character stats optimization

2. System Improvements
   - Comprehensive test coverage
   - Advanced logging system
   - Error handling
   - Analytics integration
   - Performance monitoring
   - Automated alerts
