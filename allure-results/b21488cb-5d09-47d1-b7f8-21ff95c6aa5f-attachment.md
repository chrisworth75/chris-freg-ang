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
    - tab "Draft" [selected]
    - tab "Approved"
    - tab "Live"
  - tabpanel "Draft":
    - 'heading "Fee ID: 1" [level=5]'
    - paragraph: "Value: £10.00"
    - paragraph: "Status: Draft"
```