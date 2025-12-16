import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Missing environment variables");
  console.error(
    "Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local"
  );
  process.exit(1);
}

// Use service role client to bypass RLS (we handle auth with NextAuth)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const articles = [
  {
    title: "Understanding React Server Components",
    content: `React Server Components represent a paradigm shift in how we build React applications. They allow us to render components on the server, reducing the JavaScript bundle size sent to the client and improving initial page load times.

Key benefits include:
- Zero bundle size for server components
- Direct access to backend resources
- Automatic code splitting
- Improved SEO and performance

Server Components work alongside Client Components, which handle interactivity. By default, components in the App Router are Server Components, and you opt into Client Components using the 'use client' directive.

This architecture enables a more efficient way to build React applications, especially when dealing with data fetching and rendering static content.`,
    tags: ["react", "server-components", "nextjs", "performance"],
  },
  {
    title: "Advanced TypeScript Patterns for React",
    content: `TypeScript has become essential for building robust React applications. Here are some advanced patterns that can improve your code quality and developer experience.

1. Generic Components: Create reusable components with type safety
2. Discriminated Unions: Handle different component states elegantly
3. Utility Types: Leverage Pick, Omit, and Partial for prop manipulation
4. Type Guards: Ensure type safety at runtime
5. Conditional Types: Create dynamic type relationships

These patterns help catch errors early, improve autocomplete, and make refactoring safer. When combined with React's composition model, they create a powerful development experience.

TypeScript's integration with React continues to improve, with better support for hooks, context, and component types.`,
    tags: ["typescript", "react", "patterns", "best-practices"],
  },
  {
    title: "Building Scalable APIs with Node.js and Express",
    content: `Creating scalable APIs requires careful planning and implementation. This guide covers essential patterns for building production-ready APIs with Node.js and Express.

Architecture Considerations:
- Layered architecture (routes, controllers, services)
- Error handling middleware
- Request validation with libraries like Joi or Zod
- Rate limiting and security best practices
- Database connection pooling
- Caching strategies with Redis

Performance Optimization:
- Use compression middleware
- Implement pagination for large datasets
- Optimize database queries
- Use async/await properly
- Monitor with tools like PM2 or New Relic

Security Best Practices:
- Helmet.js for security headers
- CORS configuration
- Input sanitization
- JWT authentication
- Environment variable management

Following these patterns ensures your API can handle growth while maintaining security and performance.`,
    tags: ["nodejs", "express", "api", "backend", "scalability"],
  },
  {
    title: "Mastering Git: Advanced Workflows and Strategies",
    content: `Git is more than just commits and pushes. Understanding advanced Git workflows can significantly improve team collaboration and code quality.

Branching Strategies:
- Git Flow: Feature, develop, release, and hotfix branches
- GitHub Flow: Simpler model with main and feature branches
- Trunk-based development: Frequent integration into main

Useful Commands:
- git rebase -i: Interactive rebase for clean history
- git cherry-pick: Apply specific commits
- git bisect: Binary search for bug introduction
- git reflog: Recover lost commits
- git stash: Temporary storage for work in progress

Best Practices:
- Write meaningful commit messages
- Keep commits atomic and focused
- Use .gitignore effectively
- Leverage git hooks for automation
- Regular branch cleanup

Mastering these techniques makes you more effective in collaborative development environments.`,
    tags: ["git", "version-control", "workflow", "collaboration"],
  },
  {
    title: "CSS Grid vs Flexbox: When to Use Each",
    content: `CSS Grid and Flexbox are powerful layout tools, but they serve different purposes. Understanding when to use each is crucial for efficient web design.

Flexbox - Best For:
- One-dimensional layouts (rows or columns)
- Component-level layouts
- Navigation bars
- Card layouts
- Centering items
- Distributing space along a single axis

CSS Grid - Best For:
- Two-dimensional layouts
- Page-level layouts
- Complex grid systems
- Overlapping elements
- Precise placement control
- Responsive designs with media queries

In Practice:
Many modern layouts use both together. Grid handles the overall page structure, while Flexbox manages component internals. This combination provides maximum flexibility and control.

Browser support for both is excellent, making them safe for production use. The key is choosing the right tool for each layout challenge.`,
    tags: ["css", "grid", "flexbox", "layout", "frontend"],
  },
  {
    title: "Database Indexing Strategies for Performance",
    content: `Proper database indexing can make the difference between a fast and slow application. Here's what you need to know about creating effective indexes.

Types of Indexes:
- Single-column indexes: Simple and efficient
- Composite indexes: Multiple columns in specific order
- Unique indexes: Enforce uniqueness
- Partial indexes: Index subset of rows
- Full-text indexes: For text search

When to Index:
- Columns frequently used in WHERE clauses
- Foreign key columns
- Columns used in JOIN operations
- Columns used in ORDER BY
- Columns with high selectivity

When Not to Index:
- Small tables
- Columns with low selectivity
- Frequently updated columns
- Tables with heavy write operations

Index Maintenance:
Regularly analyze query performance, remove unused indexes, and update statistics. Use EXPLAIN or EXPLAIN ANALYZE to understand query execution plans and identify optimization opportunities.`,
    tags: ["database", "performance", "sql", "optimization", "indexing"],
  },
  {
    title: "Introduction to Docker for Developers",
    content: `Docker has revolutionized how we build, ship, and run applications. Understanding Docker basics is essential for modern development.

Core Concepts:
- Images: Blueprints for containers
- Containers: Running instances of images
- Dockerfile: Instructions to build images
- Volumes: Persistent data storage
- Networks: Container communication

Common Commands:
- docker build: Create images
- docker run: Start containers
- docker ps: List running containers
- docker logs: View container output
- docker exec: Run commands in containers

Docker Compose:
Define multi-container applications in YAML. Perfect for development environments with databases, caching, and other services.

Benefits:
- Consistent environments across development, testing, and production
- Easy onboarding for new developers
- Isolation between applications
- Efficient resource usage

Docker simplifies deployment and ensures "it works on my machine" becomes a thing of the past.`,
    tags: ["docker", "containers", "devops", "deployment"],
  },
  {
    title: "RESTful API Design Best Practices",
    content: `Designing clean, intuitive APIs is crucial for developer experience and long-term maintainability. Here are key principles for REST API design.

Resource Naming:
- Use nouns, not verbs
- Plural names for collections (/users)
- Hierarchical relationships (/users/123/posts)
- Lowercase with hyphens for readability

HTTP Methods:
- GET: Retrieve resources
- POST: Create resources
- PUT: Full update
- PATCH: Partial update
- DELETE: Remove resources

Status Codes:
- 200: Success
- 201: Created
- 204: No content
- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 500: Server error

Best Practices:
- Version your API (/v1/users)
- Use pagination for large datasets
- Provide filtering and sorting
- Return consistent error formats
- Include HATEOAS links when appropriate
- Document with OpenAPI/Swagger

Well-designed APIs make integration easier and reduce support requests.`,
    tags: ["api", "rest", "design", "best-practices", "backend"],
  },
  {
    title: "Testing Strategies: Unit, Integration, and E2E",
    content: `A comprehensive testing strategy ensures code quality and prevents regressions. Understanding different testing levels is essential.

Unit Testing:
- Test individual functions/components in isolation
- Fast and focused
- High coverage of edge cases
- Tools: Jest, Vitest, React Testing Library

Integration Testing:
- Test how components work together
- Verify data flow between modules
- Database interactions
- API endpoint testing
- Tools: Supertest, Testing Library

End-to-End Testing:
- Test complete user workflows
- Real browser automation
- Slower but comprehensive
- Tools: Playwright, Cypress, Selenium

Testing Pyramid:
- More unit tests (fast, cheap)
- Moderate integration tests
- Fewer E2E tests (slow, expensive)

Best Practices:
- Write tests before fixing bugs
- Keep tests independent
- Use meaningful test descriptions
- Mock external dependencies
- Maintain test coverage metrics

Good testing practices build confidence in your code and enable fearless refactoring.`,
    tags: ["testing", "jest", "cypress", "quality-assurance", "automation"],
  },
  {
    title: "Web Performance Optimization Techniques",
    content: `Web performance directly impacts user experience and SEO. Here are essential techniques to optimize your web applications.

Loading Performance:
- Code splitting and lazy loading
- Image optimization (WebP, compression)
- Critical CSS inline
- Preload critical resources
- Use CDNs for static assets
- Minimize HTTP requests

Runtime Performance:
- Avoid layout thrashing
- Use requestAnimationFrame for animations
- Debounce and throttle event handlers
- Optimize JavaScript execution
- Virtual scrolling for long lists
- Web Workers for heavy computation

Metrics to Monitor:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)
- First Input Delay (FID)

Tools:
- Lighthouse for audits
- Chrome DevTools Performance tab
- WebPageTest for detailed analysis
- Real User Monitoring (RUM)

Performance is a feature. Investing in optimization pays dividends in user satisfaction and business metrics.`,
    tags: ["performance", "optimization", "web-vitals", "frontend"],
  },
  {
    title: "GraphQL vs REST: Choosing the Right API Architecture",
    content: `GraphQL and REST are both popular API architectures, each with strengths and trade-offs. Understanding when to use each is important.

REST Advantages:
- Simple and well-understood
- Excellent caching with HTTP
- Easy to implement and debug
- Wide tooling support
- Good for CRUD operations

GraphQL Advantages:
- Single endpoint for all data
- Client specifies exact data needs
- No over-fetching or under-fetching
- Strong typing with schema
- Real-time subscriptions
- Great for complex, related data

When to Use REST:
- Simple CRUD applications
- Public APIs with caching needs
- File uploads/downloads
- Team familiarity is low

When to Use GraphQL:
- Complex data requirements
- Multiple client types (web, mobile)
- Rapid frontend iteration
- Microservices architecture
- Real-time features needed

Hybrid Approach:
Some teams use both, with REST for simple operations and GraphQL for complex queries. The best choice depends on your specific requirements and team expertise.`,
    tags: ["graphql", "rest", "api", "architecture", "backend"],
  },
  {
    title: "Securing Your Node.js Applications",
    content: `Security should be a priority in any application. Here are essential practices for securing Node.js applications.

Authentication & Authorization:
- Use bcrypt for password hashing
- Implement JWT properly
- Session management best practices
- OAuth2 for third-party auth
- Multi-factor authentication

Input Validation:
- Validate all user input
- Use libraries like Joi or Zod
- Sanitize data before database insertion
- Prevent SQL injection
- Guard against XSS attacks

Security Headers:
- Use Helmet.js for security headers
- CORS configuration
- Content Security Policy
- HTTPS only in production

Dependency Security:
- Regular npm audit
- Update dependencies frequently
- Use npm lock files
- Monitor for vulnerabilities
- Remove unused packages

Environment Variables:
- Never commit secrets
- Use .env files (gitignored)
- Different configs per environment
- Rotate secrets regularly

Rate Limiting:
- Prevent brute force attacks
- Use express-rate-limit
- Implement per-user limits
- DDoS protection

Security is an ongoing process, not a one-time task. Stay updated on latest vulnerabilities and best practices.`,
    tags: ["security", "nodejs", "authentication", "best-practices"],
  },
  {
    title: "Modern JavaScript: ES2024 Features You Should Know",
    content: `JavaScript continues to evolve with new features that make code more expressive and powerful. Here are the latest additions worth learning.

Top-level Await:
- Use await in modules without async function wrapper
- Simplifies module initialization
- Better handling of async dependencies

Array.prototype.at():
- Negative indexing for arrays
- More intuitive than arr[arr.length - 1]
- Works with strings too

Object.hasOwn():
- Safer alternative to hasOwnProperty
- Better for objects without prototypes
- Cleaner syntax

Error Cause:
- Chain errors with cause property
- Better error context
- Improved debugging

Promise.any():
- Resolves with first fulfilled promise
- Rejects only if all reject
- Useful for fallback scenarios

Numeric Separators:
- Improve readability of large numbers
- const billion = 1_000_000_000
- Works with binary and hex

These features improve code readability and reduce common bugs. Stay current with JavaScript evolution to write better code.`,
    tags: ["javascript", "es2024", "modern-js", "features"],
  },
  {
    title: "Microservices Architecture: Patterns and Practices",
    content: `Microservices architecture offers scalability and flexibility but introduces complexity. Here's what you need to know.

Core Principles:
- Single responsibility per service
- Independent deployment
- Decentralized data management
- Failure isolation
- Technology diversity

Communication Patterns:
- Synchronous: REST, gRPC
- Asynchronous: Message queues (RabbitMQ, Kafka)
- Event-driven architecture
- API Gateway pattern
- Service mesh (Istio, Linkerd)

Data Management:
- Database per service
- Event sourcing
- CQRS pattern
- Saga pattern for distributed transactions
- Eventual consistency

Challenges:
- Distributed system complexity
- Network latency
- Data consistency
- Testing complexity
- Monitoring and debugging

Best Practices:
- Start with a monolith, split when needed
- Implement comprehensive logging
- Use circuit breakers
- Health checks and self-healing
- Automated deployment pipelines

Microservices aren't always the answer, but when done right, they enable teams to scale independently.`,
    tags: ["microservices", "architecture", "distributed-systems", "backend"],
  },
  {
    title: "Tailwind CSS: Utility-First Styling",
    content: `Tailwind CSS has gained massive popularity with its utility-first approach. Here's why and how to use it effectively.

Why Tailwind:
- Rapid development speed
- Consistent design system
- Small production bundle
- No naming fatigue
- Easy responsive design

Core Concepts:
- Utility classes for everything
- Mobile-first responsive design
- Arbitrary values when needed
- Component extraction with @apply
- Dark mode support built-in

Best Practices:
- Use configuration file for customization
- Extract components for repeated patterns
- Leverage JIT mode for on-demand classes
- Use prettier-plugin-tailwindcss
- Create custom utilities sparingly

Advanced Features:
- Container queries
- Custom variants
- Plugin system
- Functions and directives
- Group and peer modifiers

Common Critiques:
- HTML looks cluttered (trade-off for speed)
- Learning curve for class names
- Different from traditional CSS

Tailwind fundamentally changes how you write CSS, prioritizing speed and consistency over convention.`,
    tags: ["tailwind", "css", "styling", "frontend", "utility-first"],
  },
  {
    title: "CI/CD Pipelines with GitHub Actions",
    content: `Continuous Integration and Deployment streamlines development workflows. GitHub Actions makes CI/CD accessible and powerful.

Basic Concepts:
- Workflows: Automated processes
- Jobs: Steps that run on runners
- Actions: Reusable units of code
- Triggers: Events that start workflows
- Secrets: Secure environment variables

Common Workflows:
- Run tests on every pull request
- Build and deploy on merge to main
- Lint and format code
- Security scanning
- Automated releases

Example Pipeline:
1. Checkout code
2. Setup Node.js environment
3. Install dependencies
4. Run linters
5. Run tests
6. Build application
7. Deploy to production

Advanced Features:
- Matrix builds for multiple versions
- Caching dependencies
- Parallel jobs
- Environment protection rules
- Deployment gates

Best Practices:
- Keep workflows DRY
- Use marketplace actions
- Secure secrets properly
- Monitor workflow performance
- Fail fast on critical errors

Automated pipelines reduce human error and speed up delivery. Invest time in good CI/CD setup for long-term productivity gains.`,
    tags: ["cicd", "github-actions", "devops", "automation", "deployment"],
  },
];

async function seedArticles() {
  try {
    // Get all users
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("id, name")
      .order("created_at", { ascending: true });

    if (userError || !users || users.length === 0) {
      console.error("Error fetching users or no users found:", userError);
      console.log("Please create users first by running: npx tsx scripts/seed-users.ts");
      return;
    }

    console.log(`🌱 Starting article seeding...\n`);
    console.log(`Found ${users.length} users to distribute articles among\n`);

    let articleCount = 0;
    let userIndex = 0;

    for (const article of articles) {
      // Rotate through users
      const author = users[userIndex % users.length];
      
      const { error } = await supabase.from("articles").insert({
        title: article.title,
        content: article.content,
        tags: article.tags,
        author_id: author.id,
      });

      if (error) {
        console.error(`❌ Error inserting article "${article.title}":`, error);
      } else {
        articleCount++;
        console.log(`✓ Created article: "${article.title}" by ${author.name || 'Unknown'}`);
      }

      userIndex++;
    }

    console.log(`\n✅ Article seeding completed!`);
    console.log(`\n📋 Summary:`);
    console.log(`- ${articleCount} articles created`);
    console.log(`- Distributed among ${users.length} users`);
    console.log(`- ~${Math.ceil(articleCount / users.length)} articles per user`);
  } catch (error) {
    console.error("Error seeding articles:", error);
  }
}

seedArticles();
