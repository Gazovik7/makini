# MCP - Page content structure

Type: Website
Status: Not started
Sub-item: FAQ for MCP (https://app.notion.com/p/FAQ-for-MCP-3728cb6d170b8022974ccd3c02aca945?pvs=21), MCP tools list (https://app.notion.com/p/MCP-tools-list-3728cb6d170b80d09b69e254c93657c7?pvs=21), MCP Website questions (https://app.notion.com/p/MCP-Website-questions-36f8cb6d170b802c9432dcf2f5888405?pvs=21), Create hero image (https://app.notion.com/p/Create-hero-image-3728cb6d170b80fc9528c8199709179d?pvs=21), Later - icons for tools on MCP pages (https://app.notion.com/p/Later-icons-for-tools-on-MCP-pages-3738cb6d170b80b3ac2ce28713f8777e?pvs=21)
Engineer alert: No
Quality issue?: No
Formula: Missing date

1. **Hero**
    - Breadcrumb: Home > Integrations > MCP > `Product`
        
        [www.makini.io/mcp/](http://www.makini.io/integrations/hai-robotics-wms-integration)product
        
    - Integration ↔ MCP
        
        linking to the sibling API page at /integrations/`product`
        
    - Product logo
    - H1: "`Product` MCP Server"
    - Subhead: Give your agent real-time access to `Product`, with 2,000+ industrial systems behind the same server
    - CTAs:
        - "Schedule demo"
        - "Read docs"
    - Inline trust: one MCP | 2,000+ products | SOC 2 Type II
    - [ ]  Hero image - [Create hero image](https://app.notion.com/p/Create-hero-image-3728cb6d170b80fc9528c8199709179d?pvs=21)
        
        Infor, MaintainX, Netsuite, Corrigo
        
        - Information
            
            First, the right-side grid. Merge fills it with CRMs and dev tools: Salesforce, GitHub, Dropbox, Notion, Xero, HubSpot. That is their turf. Yours is the industrial stack nobody else connects to. Fill that grid with SAP, NetSuite, IBM Maximo, Dynamics, Infor, Fiix, Asset Essentials, and so on, ending on a "+2,000" tile. The grid alone tells the buyer you serve a different and harder world. Show it, do not say it. One caution: use the connected-system logos here, not your customer logos. Siemens and ServiceTitan belong in the logo wall (Section 2), not in this grid, or you imply your customers are the systems being connected.
            Second, the center card lines. Merge lists features ("Thousands of pre-built tools," "Authentication and credential management"). Lead with benefits instead, and keep them in the positioning you landed on: breadth, real-time, governed. No mechanism, no contrast.
            
2. Logo wall
    
    "Makini powers integrations for" + customer logos (Siemens, ServiceTitan, Caterpillar, Trane, Tractian, Kion, Uptake)
    
3. Connect `Product` to Claude, ChatGPT, Cursor or any other agent
    
    Works out-of-box with your favorite AI agents
    
    Claude, ChatGPT, Cursor, LangChain, Custom MCP SDK
    
    - [ ]  Cards with AI company logos
        
        When clicked, transfer to blog on how to connec 
        
    - [ ]  Write instructions on how to connect to agents
        
        [Connect tool to Claude](https://app.notion.com/p/Connect-tool-to-Claude-3728cb6d170b8012ad38c4666f5a03de?pvs=21) 
        
        [Connect tool to ChatGPT](https://app.notion.com/p/Connect-tool-to-ChatGPT-a0c8cb6d170b83cf8a920155c62716b8?pvs=21) 
        
4. Available tools & resources for `Product`
    
    [MCP tools list](https://app.notion.com/p/MCP-tools-list-3728cb6d170b80d09b69e254c93657c7?pvs=21) 
    
    Similar to the current list of end-points
    
    ![image.png](image.png)
    
5. **Why teams choose Makini**
    
    ![image.png](image%201.png)
    
    **Eyebrow**
    
    ONE MCP. EVERY INDUSTRIAL PRODUCT.
    
    Headline
    
    `Product` integration your roadmap keeps pushing. Already built.
    
    **Subheading**
    
    Connect once over MCP. Your agent reads data and triggers actions in Hai Robotics WMS, plus 2,000 other systems, without you building or maintaining a single integration.
    
    1. Your agent runs `Product`
        
        One MCP endpoint and your agent can pull data and act on `Product`. The same connection reaches 2,000+ other products behind it.
        
    2. Build the agent once
        
        Your agent gets `Product`'s real objects and actions, not a stripped-down common denominator. Work orders stay work orders, assets stay assets. Add SAP or Maximo through the same server when you need them.
        
    3. AI Agent only does what it's allowed to
        
        Each connection runs on its own scoped credentials, so the agent inherits your access model. Every call is logged, so you can see exactly what it did.
        
6. **Live in three steps**
    
    ![[https://www.merge.dev/merge-agent-handler](https://www.merge.dev/merge-agent-handler)](image%202.png)
    
    [https://www.merge.dev/merge-agent-handler](https://www.merge.dev/merge-agent-handler)
    
    Headline
    
    Live in three steps
    
    1. Connect `Product`
        
        Log in. That's the integration. Pick `Product` and sign in with the credentials you already use. No API keys to chase, no integration to build. Connected in under a minute.
        
        - [x]  Visual: Makini Link connection expereince
    2. Get your MCP endpoint
        
        One endpoint, scoped and logged. Makini gives you a single MCP endpoint and a token scoped to that login. The agent can only touch what those credentials allow, and every call lands on the log.
        
        - [ ]  Visual: Makini dashboard view of the connection showing the MCP endpoint URL and the scoped token, ideally with a permission scope and a log line visible so the "scoped and logged" claim is shown, not just told.
            
            Might need input from @Roman Kinyakin - if customer is using Claud or ChatGPT, they can maybe copy a credential. In other cases, maybe download a JSON. Ask Roman what is the best experience
            
    3. Point your agent at it
        
        One config block, any MCP client. Paste the endpoint into Claude, n8n, LangChain, or whatever you run. Your agent gets the same tools it uses on every other system: search, get, create, update.
        
        - [ ]  Visual
            
            the client picker (Claude, ChatGPT, Cursor, Winsurf, n8n - ask @Roman Kinyakin for help) as tabs . Each tab shows the right kind of instruction for that client, not the same JSON for all of them the way the reference does.
            
            - Pick Claude or ChatGPT: show the UI connector flow. Click add, log into Hai Robotics WMS with your normal credentials, authorize, tools are live. No token, no file, no endpoint to copy.
            - Pick Cursor, Claude, Windsurf, VS Code, n8n, or API: show the config block and the docs link. Endpoint, scoped token, paste, restart.
            
            ![image.png](image%203.png)
            
7. How it works
    
    Eyebrow
    
    HOW IT WORKS
    
    Headline
    
    One managed server between your agent and every system
    
    Description
    
    MCP is an open standard for giving AI agents tools to act. Makini runs as a managed MCP server in front of `Product` and your wider stack. Your agent hits one endpoint, and Makini handles auth, real-time pass-through, and logging across all 2,000 products behind it.
    
    Diagram
    
    ![Reference](image%204.png)
    
    Reference
    
    - Left node: **Your agent** / sub-label: Claude, Cursor, ChatGPT, or your own
    - Center node (the hero): **Makini MCP server**, with three stacked pills inside: Authentication / Real-time pass-through / Logging
    - Right side: the universal tool set as chips, **search · get · create · update**
    - Tag chips anchored to the center node: **Tools & resources · Streaming · Scoped tokens**
    
    **Composition.** Same left-to-right axis as your reference, and for the same reason: it matches reading order and the actual flow. Three zones. Who calls (agent), what sits in the middle (Makini), what gets reached (systems). Make the Makini server the hero. Largest, brightest, centered. Your agent and your systems are supporting cast. The three inner pills (auth, normalization, logging) are what visually earn the word "managed," so keep them inside the box exactly like the reference's pills.
    
8. **Capabilities: Everything your agent can do over MCP**
    
    ![image.png](image%205.png)
    
    Eyebrow
    
    WHY MAKINI MCP
    
    Headline
    
    Everything your agent needs to act on industrial systems
    
    Description
    
    The hard part of an agent isn't the model. It's giving it safe, reliable access to the systems that actually run the business. Makini handles that part. Connect once over MCP and your agent reads and acts on `Product` plus 2,000 other systems, with auth, scoping, and logging built in.
    
    CTA
    
    Schedule demo
    
    1. Native tools, not a lowest common denominator
        
        Your agent calls the same four tools, search, get, create, update, across all 2,000 systems. It runs real endpoints, objects, and filters, exposed in real time. Custom fields and custom objects included. No abstract data model to learn, and nothing lost in translation.
        
        - [ ]  Visual: a single tool list (search / get / create / update) on the left, fanning out to a grid of product cards. The reference's stacked-connector look, inverted to show one toolset reaching many systems.
            
            ![image.png](image%206.png)
            
    2. Reach systems that never had an API
        
        Plenty of industrial software never shipped a REST API or an MCP server, including 20-year-old on-prem systems. Your agent reaches them anyway. Almost no other MCP provider can.
        
        - [ ]  Visual: a dated on-prem system on one side (server rack or a vintage desktop UI), connected through Makini to a modern agent on the other. The contrast carries the point.
    3. Connect by logging in
        
        Pick a product and sign in with the credentials you already use, whether it's you, your code, or an agent over MCP. The same login flow works everywhere.
        
        - [ ]  Visual: the Makini Link auth screen (pick product, enter credentials), into a "Connected" success state. This is your existing GIF, repurposed.
    4. Scoped, logged, accounted for
        
        Each connection runs on its own token and can only do what those credentials allow in the source system. Every call the agent makes is logged and searchable, so you can see exactly what it did.
        
        - [ ]  Visual: a call log showing agent actions with timestamps, paired with a scope or permissions badge on the token. The reference's "enterprise security" panel, as an audit log rather than a violations chart.
    5. Works with any MCP client
        
        Point Claude, ChatGPT, Cursor, or n8n at your endpoint with one config block. No custom adapters, no lock-in, switch clients anytime.
        
        - [ ]  Visual: a row of client logos (Claude, ChatGPT, Cursor, n8n) all arrowing into a single Makini endpoint, or the client-tabbed config block from the setup widget so the two sections rhyme.
    6. Connections that don't silently break
        
        Makini monitors every tool call and alerts you the moment one fails, with the error detail to fix it. Your agent is never quietly calling a tool that went dead.
        
        - [ ]  Visual: an alert card ("Sync failed on [system], here's why") sitting above a healthy green status list. Mirrors the reference's monitoring chart, but as an alert plus status rather than a graph.
9. **Security & governance: Built for agents you can trust**
    
    Eyebrow
    
    SECURITY AND GOVERNANCE
    
    Headline:
    
    Control what the agent touches. See everything it does.
    
    Description:
    
    Writing to a live CMMS or ERP is where teams get nervous, and they are right to be. Makini hands you the controls. Every connection is scoped to what its credentials can do, every call the agent makes is logged. Highest security rating from the most demanding in the business. SOC 2 Type II, UK Cyber Essentials, and GDPR compliant.
    
    CTA:
    
    Security at Makini - leads to security page or trust center
    
    **Four pillars**
    
    1. Scoped, revocable access
    Each connection runs on its own token, scoped to what its credentials can do in the source system. Revoke it and the agent is locked out immediately.
    2. A log of every action
    Every call the agent makes is logged and searchable. Stream the audit trail into your own stack, Sentry, a webhook, or syslog, so it sits where your team already looks.
    3. Independently verified
    SOC 2 Type II and UK Cyber Essentials, with independent penetration tests twice a year.
    4. Run it where compliance demands
    In-region hosting for the EU, UK, Canada, and Australia, a dedicated single-tenant instance, or self-hosted entirely in your own environment. GovCloud and ITAR are supported and running in production today.
    - [ ]  Visual.
        
        Badges: GDPR, Soc 2 Type II, ITAR, UK Cyber essentials
        

1. **Explore other MCP servers**
    
    Products logo grid - like on integrations page
    
2. **What is `Product`**
    
    Reuse from the API page. Captures the product-name query.
    
3. **Final CTA**
    - "Connect your agent to [Product]." Keep the mockup's version.
    - [ ]  Visual
4. **FAQ**
    - [ ]  [FAQ for MCP](https://app.notion.com/p/FAQ-for-MCP-3728cb6d170b8022974ccd3c02aca945?pvs=21)
5. **Footer**
    
    Site standard
    

- Later
    1. **Use cases for [Product] (NEW, optional, SEO + imagination)**
        - 3-4 agent scenarios by product category (e.g. CMMS: agent triages incoming work orders; pulls asset history before dispatch; reconciles spare-parts inventory across sites). Marketing-owned, templatable by category. Can fold into the FAQ if you want to keep the page shorter.
        1. **7. Drop-in setup: Add Makini to your agent**
            - Code block 1: mcp.config.json with endpoint URL + auth header
            - Code block 2: example tool call returning a result as an MCP resource
            - `[CONFIRM J: real endpoint URL, exact auth header format, transport, the real tool name and payload schema shown]`