# Page snapshot

```yaml
- banner:
  - navigation "Custom navbar":
    - link "MyApp":
      - /url: "#"
    - list:
      - listitem:
        - link "Fees":
          - /url: /fees
      - listitem:
        - link "Create Fee":
          - /url: /create
      - listitem:
        - link "Data Table":
          - /url: /datatable
    - list:
      - listitem:
        - link "Logout":
          - /url: /logout
- main:
  - tablist:
    - tab "Draft"
    - tab "Approved" [selected]
    - tab "Live"
  - tabpanel "Approved"
```