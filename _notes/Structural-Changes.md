
- The initial structural changes visible on the `structural-updates` branch are part of architectural modifications in the frontend Angular project.

- The plan is to implement a clean architecture that supports scalability and reusability. This includes:
  - A well-defined folder structure.
  - Separation of Concerns.
  - Component-based development (using a granularity approach).
  - Modularity.

- The architecture should adhere to the following:
  - Domain Layer:
    - Service: Used for fetching data from the backend.
    - Entities: Models that include entities for use when fetching data from the backend.
    - Compositions: Contain domain logic and are responsible for calling service functions, fetching data, and transforming and returning it. Composition files can then be utilized in view files (component logic files).

  Each section in the above layer should adhere to the Single Responsibility Principle:
  - For example, the User service should be responsible solely for backend operations related to users. The User model should only contain properties related to users.
  - Files related to 'Members' should focus exclusively on member-related operations.
  - 'Clubwall' should only encompass club wall-related operations, services, and models, etc.

  This approach ensures that the core layer is modular and can be easily ported or copied to any other TypeScript-supported framework with minimal effort.

- A recommended structure to support these architectural choices would be as follows (although there is always room for improvement):
``` console
├───app
│   ├───@core
│   │   ├───constants
│   │   │   └─── constants set for the whole app
│   │   ├───entities/models
│   │   │   └─── Entity models used in the app
│   │   ├───guards
│   │   │   ├─── access.guard.ts
│   │   │   ├─── auth.guard.ts
│   │   │   ├─── logout.guard.ts
│   │   │   └─── noAuth.guard.ts
│   │   ├───helpers
│   │   │   └─── helpers files to support the app
│   │   ├───services
│   │   │   └─── services files used to fetch data from the backend only
│   │   ├───ui
│   │   │   ├───components
│   │   │   │   │───sidebar
│   │   │   │   └───topbar
│   │   │   └───pages
│   │   │       │───access-restricted
│   │   │       └───not-found
│   │   ├───usecases
│   │   │   └─── usecases/compositions files used to get data from the services, mutate or manipulate and pass it to the views.
│   │   └───utils
│   │       └─── utils files containing utility functions
│   ├───shared
│   │   ├───components
│   │   │   └─── Shared Components to be able to use in whole app (for reusability)
│   │   ├───directives
│   │   │   └─── Shared Directives to be available in whole app (for reusability)
│   │   └───pipes
│   │       └─── Shared Pipes to be available in whole app (for reusability)
│   └───pages/modules
│       ├───_shared
│       │   └─── Shared pages to be used with in other views scoped in pages folder.
│       └─── All other folders inside are scoped as an individual Dashboard of a user e.g; 
             User type 2 Dashboard will have all its views.pages inside User type 2 folder.
├───assets
└───environments
``` 

- `Core`: As the name suggests, this folder serves as the core of the app and encompasses all core responsibilities, including the layers described above.
  - `constants`: This will hold app constants and default values, similar to app settings.
    - This folder can also include enums, or we can create a separate folder specifically for `enums`.
  - `entities`: Will contain entity models. This can either include models for the entire app or we could have a separate folder for interfaces related to our views.
  - `guards`: This will contain all Angular guards used within the app.
  - `helpers`: This can hold helper files like authentication utilities, interceptors, error handlers, and query builders, etc.
  - `services`: Will contain all Angular services used for backend operations.
    - Each service file should adhere to the Single Responsibility Principle and, if possible, implement REST functions like `get`, `find`, `create`, `update`, `delete`, etc.
    - This folder can also house state or data services, and any other required services.
    - UI-related custom services like modal, loading, or toaster services can be moved to the `shared > services` folder as well.
  - `usecases`: Also referred to as compositions, this will include custom-named functions that utilize service functions to map, transform, and mutate data for our views. Views can then call these functions. This should serve as the intermediary between services and components, eliminating the need for direct communication between the two.
  - `utils`: Will include utility functions that are independent of any other layer, such as slugify, data transformers, array utilities, object utilities, local storage helpers, validators, etc.
  - `ui`: This can either reside outside of `Core` in a `theme` folder or within `Core` itself. It will contain the core layout of the app and components like the header and sidebar, which need to remain consistent throughout the app. Other pages like "Page Not Found" or "Access Denied" can be moved to a shared folder.
- `Shared`:
  - Will contain components, directives, pipes, etc., that are shared and can be used in UI pages.
  - May also include a `modules` folder for modules composed of a bunch of components like custom calendars or tables, although it is preferable to keep these as components.
- `Pages`:
  - Will contain all individual pages rendered to the user, built using shared components.
    - We can manage multiple user dashboards by creating a separate folder for each.
    - Pages can also be called modules or views.
- `Assets`:
  - Will contain all app assets such as images, icons, language files, etc.


## Things to Consider During Development

#### Use of Services for Each Individual Task

- **Why**: Services encapsulate specific functionalities and can be injected across different compositions or components, making the code DRY (Don't Repeat Yourself) and modular.

- **Best Practice**: For instance, create a `UserService` specifically for user-related operations, including API calls, local storage, and session management.


#### Use of Interceptors

- **Why**: Interceptors serve as middleware to modify or cancel HTTP requests and responses. They are useful for handling tokens, authentication, and logging.

- **Where to Use**: You can use interceptors to inject a token into every HTTP request for authentication or to set global headers for all outgoing requests.


#### Proper Use of Observables and Unsubscribing

- **Why**: Observables offer a way to handle asynchronous operations and multiple values. Failing to unsubscribe can lead to memory leaks and unnecessary API calls.

- **Best Practice**: Always unsubscribe from Observables when the component is destroyed. Use Angular's `takeUntil` or `async` pipe for clean management.


#### Global Error Handler

- **Why**: It provides a centralized place for handling all errors that occur during the application lifecycle.

- **Best Practice**: Create a global error handler that can catch errors and display a user-friendly message using toasters. This handler can also be injected into interceptors or services to catch and handle specific errors like 500 or 401.

#### Remove Unnecessary Dependencies

- **Why**: Unneeded dependencies can bloat the application, causing longer load times and potential conflicts.

- **Best Practice**: Remove redundant packages, such as a Paper Kit dashboard template if you're using Bootstrap for layout and writing custom CSS.


#### Global CSS and SCSS Usage

- **Why**: Global CSS ensures consistent styling across the app. SCSS offers variables and nesting which make managing styles easier.

- **Best Practice**: Use global styles for overall consistency and then override these styles in individual components as needed.


#### Avoid Using jQuery

- **Why**: jQuery and Angular both manipulate the DOM, which can lead to conflicts and unpredictable behavior.

- **Best Practice**: Stick to Angular for all DOM manipulations.


#### Use of Directives and Pipes for Translation

- **Why**: Directives and pipes can dynamically translate content, making the app more adaptable to different locales without requiring a reload.
#### Component-Based Development

- **Why**: This approach enhances reusability, maintainability, and testability. It makes the app easier to reason about.

#### Lazy Loading of Modules

- **Why**: Lazy loading defers the initialization of the module until it’s needed, which improves the app’s initial load time.

- **Best Practice**: Use lazy loading for members and mobile app pages. Make sure each lazy-loaded module has its own routing configuration for better Separation of Concerns (SoC).


#### Linting (ESLint)

- **Why**: ESLint identifies patterns in TypeScript and helps you follow best practices, leading to cleaner, more consistent code.

- **Specific Rules to Follow**:

  - Use `===` instead of `==` to avoid type coercion issues.
  - Prefer `const` and `let` over `var`.
  - Use object dot notation instead of string literals where applicable.
  - Favor arrow functions for cleaner and more concise function expressions.

#### Naming Conventions in TypeScript

- **Why**: Consistent naming conventions make the code more readable and maintainable.

- **Best Practice**: Stick to a naming convention for variables, properties, and functions. For example, `camelCase` for variables and `PascalCase` for classes.


#### Access Modifiers and Private Functions

- **Why**: Access modifiers control the visibility of class members, enhancing encapsulation.

- **Best Practice**: Use private functions for logic that is closely bound to and used within the component.


#### Proper Function Documentation

- **Why**: Detailed documentation makes it easier for other developers to understand the purpose and usage of a function.

- **Best Practice**: Use JSDoc comments to include details such as what the function does, its parameters, and its return type. Include examples where possible.


#### Utility Functions

- **Why**: Breaking down code into utility functions enhances reusability and testability.

- **Best Practice**: Where required, abstract simple conversions and repeated logic into utility functions.


#### StandardJS and ESLint

- **Why**: StandardJS rules help in maintaining a consistent coding style across the project. Many companies use these rules to standardize code.

- **Best Practice**: Follow the rules defined at [StandardJS](https://standardjs.com/rules.html) and enforce them using ESLint for static code analysis.

#### Developer-Friendly Practices

- **Commented Code**: Ensures easier understanding and debugging.

- **Development Documentation**: Crucial for onboarding new developers and maintaining the project in the long term.

- **Release Notes and Change Logs**: Vital for tracking the changes, especially in larger and more complex projects.


## Why We Need This Structure in an Angular App

1. **Organized Codebase**: A well-structured architecture makes it easier to locate files and components, improving development speed and maintainability.

2. **Separation of Concerns**: This structure ensures that each part of the code has a specific task, making it easier to manage and test.

3. **Scalability**: The architecture is designed to grow with your project. You can easily add more features, services, or components without disrupting the existing architecture.

4. **Reusability**: Components, services, and utilities are designed to be reusable, saving time and reducing the likelihood of bugs by using already tested pieces of code.

5. **Single Responsibility Principle (SRP)**: Each element in the architecture—be it a service, entity, or composition—has a singular focus. This approach simplifies updates and contributes to a more stable codebase.

6. **Optimized Performance**: With this architecture, it's easier to implement lazy-loading and other performance optimizations.

7. **Maintainability**: The structure is easy to understand and maintain. New team members can quickly grasp the layout of the project, and you can isolate and fix bugs more efficiently.

8. **Interoperability**: By maintaining modularity and a domain layer, it’s easier to port or copy the core logic to another TypeScript-supported framework if ever needed.


## Issues Resolved

1. **Spaghetti Code**: A disorganized codebase can make it difficult to make updates or add new features. This structure prevents that issue.

2. **Code Duplication**: A lack of reusability can lead to duplicated code, which makes the app harder to maintain and more error-prone. The 'Shared' and 'Core' layers help to mitigate this issue.

3. **Performance Bottlenecks**: Without proper structure, performance optimization becomes a hassle. This structure supports lazy-loading and other optimization techniques.

4. **Development Speed**: When a project grows without a solid structure, it becomes increasingly difficult and time-consuming to add new features. The modularity of this architecture allows for quicker feature development.

5. **Dependency Management**: The clean architecture allows for better management of dependencies, making the codebase more robust and easier to test.

6. **Team Collaboration**: In large projects with multiple developers, an organized codebase is essential for effective collaboration. This architecture allows for better version control and more efficient parallel development.
