# Prompt: Create React Component from Figma Design

## Task
Create a React component based on a Figma design URL. Follow the project's existing patterns and conventions.

## Input
- Figma design URL: `$ARGUMENTS`

## Step-by-Step Instructions

### 1. Extract Design Information
- Extract the node ID from the Figma URL
- Retrieve the component code and design specifications including:
  - CSS properties and styles
  - Design tokens (colors, fonts, spacing)
  - Component structure
  - Any required assets (images, icons)

### 2. Analyze Visual Design
- Get the visual representation of the component
- Identify all interactive elements
- Note hover states, focus states, and transitions
- Document accessibility requirements

### 3. Study Project Structure
- Check existing UI components directory structure
- Review existing button/component patterns
- Identify the styling system (Tailwind, CSS-in-JS, styled-components, etc.)
- Locate utility functions (like `cn()` for class merging)
- Find where assets are typically stored

### 4. Handle Assets
- Download any required images/icons from the Figma export
- Save them to the appropriate local directory (e.g., `src/images/`)
- Use local imports instead of external URLs
- Name assets descriptively (e.g., `rosetta-icon.svg`)

### 5. Create the Component
Follow these guidelines:

### 6. Style Guidelines
- Create a pixel-perfect implementation based on the Figma design
- Include all states: default, hover, focus, active, disabled
- Add proper transitions for smooth interactions
- Ensure responsive design if applicable
- Match exact colors, spacing, and typography from Figma

### 7. Update Exports
- Add the new component to the appropriate index file
- Maintain alphabetical order in exports
- Follow the project's export conventions

### 8. Quality Checks
- Run the project's linting/formatting commands
- Ensure TypeScript types are correct
- Verify no import errors
- Check that the component matches the Figma design exactly

## Additional Considerations

- **Accessibility**: Include proper ARIA labels, roles, and keyboard navigation
- **Performance**: Optimize images and use proper React patterns
- **Reusability**: Make the component flexible with customizable props
- **Documentation**: Include usage examples in comments
- **Testing**: Consider how the component will be tested

## Error Handling
- If assets fail to download, provide fallbacks
- Handle missing props gracefully
- Provide meaningful error messages in development