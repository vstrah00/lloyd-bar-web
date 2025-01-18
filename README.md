# Game Plan
Current focus on functionality, later the focus will turn to the beauty factor
- [x] **Create the navbar** properly according to the project requirements  
- [x] **Implement the menu**; new products are added via Sanity and automatically appear in the Menu section  
- [x] **Disable scrolling** when the hamburger menu is open  
- [ ] **Sanity**:  
  - Add a `serialNumber` field to categories for custom sorting  
  - Add a second language for products if needed
- [ ] **Highlight the current page** the user is on  
- [x] **Create the footer**
- [ ] **Implement "Make your own cocktail"**
- [ ] **Integrate dark mode**  
- [ ] **Add EN/CRO** (language toggle)  
- [ ] **Games and rewards** section  
- [ ] **Sentry integration** for bug tracking and issue reporting
- [ ] **FIX CURRENT BAD STYLING**

#

# Lloyd's Beach Bar Website

This repository contains the source code for the official website of Lloyd's Beach Bar. The website provides information about the bar, including the menu, events, gallery, and contact details. Additionally, it features a user login system for accessing exclusive content and functionalities.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Home Page**: Overview of Lloyd's Beach Bar.
- **Menu**: Detailed list of food and drinks.
- **Events**: Information about upcoming events and parties.
- **Gallery**: Photos of the bar and events.
- **Contact**: Contact form and location details.
- **User Login**: Access to special offers, and personalized experiences.

## Technologies Used

- **Frontend**:
  - [Next.js](https://nextjs.org/)
  - [Tailwind CSS](https://tailwindcss.com/)

- **Content Management**:
  - [Sanity.io](https://www.sanity.io/)

## Architecture

The architecture of the website follows a modern JAMstack approach:

- **Frontend**: Built with Next.js, it provides a server-side rendering and static site generation for improved performance and SEO. Tailwind CSS is used for styling, offering utility-first CSS classes for rapid UI development.
- **Content Management**: Sanity.io is used as the headless CMS, allowing for easy content creation and management. Sanity provides a real-time backend and query language (GROQ) for fetching content.


## Usage

1. **Visit the Home Page**: Get an overview of Lloyd's Beach Bar.
2. **Explore the Menu**: Browse through our food and drinks offerings.
3. **Check Events**: Stay updated on upcoming events and parties.
4. **View Gallery**: See photos from our bar and events.
5. **Contact Us**: Reach out to us via the contact form or find our location.
6. **Login**: Access exclusive content, make reservations, and more.

## Contributing

We welcome contributions to improve our website! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
