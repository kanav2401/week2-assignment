
# Design Decisions — Nexora Technologies

## 1. Brand Direction

Nexora Technologies is presented as a modern digital solutions company.

The website uses a dark forest-green background with lime and mint accents to create a professional, modern and recognizable visual identity.

The overall design focuses on simplicity, readability and a clean user experience.

## 2. Color Palette

- Dark forest green: Primary background and major sections.
- Lime green: Buttons, highlights and important elements.
- Mint green: Secondary accents and decorative details.
- White: Main headings and important text.
- Soft grey: Supporting text and descriptions.

These colors are used consistently throughout all four pages.

## 3. Typography

Two Google Fonts are used:

- Manrope: Headings and brand text.
- DM Sans: Navigation, paragraphs, labels and form controls.

The combination provides a clear visual hierarchy and improves readability.

## 4. Layout and Structure

The website contains four interconnected pages:

- Home
- About
- Services
- Contact

A shared navigation header and footer maintain consistency across the website.

CSS Grid is used for major content layouts, while Flexbox is used for navigation, buttons and smaller alignments.

## 5. Responsive Design

The website adapts to different screen sizes using CSS media queries.

The layout is designed to support:

- Mobile devices
- Tablets
- Desktop screens

The navigation changes to a mobile menu on smaller screens.

## 6. JavaScript Functionality

JavaScript is used for the following interactions:

- Mobile navigation menu toggle.
- Closing the mobile menu after selecting a page.
- Automatically updating the footer year.
- Contact form validation.
- Displaying inline validation errors.
- Showing form submission feedback.

## 7. Contact Form Validation

The contact form validates:

- Name must contain at least two characters.
- Email must follow a valid email format.
- A subject must be selected.
- Message must contain at least ten characters.
- User consent must be checked.

Error messages are displayed when the submitted information is invalid.

The form is frontend-only and does not send or store messages.

## 8. Accessibility Considerations

- Semantic HTML elements are used.
- Navigation controls include accessible labels.
- The mobile menu uses the `aria-expanded` attribute.
- Form fields include associated labels.
- Validation errors are displayed near their respective fields.

## 9. Project Limitations

This project is a frontend website developed using HTML, CSS and vanilla JavaScript.

It does not include:

- Backend integration.
- Database connectivity.
- User authentication.
- Actual email delivery.
- Persistent contact form submissions.

These features would require additional backend development or third-party services.

## 10. Conclusion

The Nexora Technologies website demonstrates the use of HTML5, CSS3 and JavaScript to build a modern, responsive, multi-page company website with interactive navigation and client-side form validation.
