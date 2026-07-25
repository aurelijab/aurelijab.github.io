const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (header) {
  const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (menuToggle && siteNav) {
  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  menuToggle.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    siteNav.classList.toggle("is-open", willOpen);
    document.body.style.overflow = willOpen ? "hidden" : "";
  });

  siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px" },
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const dashboard = document.querySelector("[data-soc-dashboard]");

if (dashboard) {
  const alerts = [
    {
      id: "ALT-2841",
      title: "Impossible travel detected",
      category: "Identity & access",
      age: "2 min ago",
      severity: "Critical",
      state: "New",
      asset: "AB-PROD-04",
      score: 92,
      user: "a.budreckyte",
      ip: "185.220.101.42",
      mitre: "T1078",
      note:
        "Two successful sign-ins occurred from Boston and Frankfurt within eleven minutes. The source IP has prior anonymizer activity. Validate the user session and revoke active tokens if unauthorized.",
      next:
        "Confirm user travel status · Review MFA logs · Check adjacent identity activity · Preserve sign-in evidence",
    },
    {
      id: "ALT-2838",
      title: "PowerShell encoded command",
      category: "Endpoint detection",
      age: "7 min ago",
      severity: "High",
      state: "Investigating",
      asset: "FIN-WS-22",
      score: 81,
      user: "svc-reports",
      ip: "10.24.8.19",
      mitre: "T1059.001",
      note:
        "An encoded PowerShell process spawned from a document reader and contacted a newly observed domain. Parent-child process behavior is inconsistent with the host baseline.",
      next:
        "Isolate endpoint · Decode command · Collect process tree · Search hash and domain across the environment",
    },
    {
      id: "ALT-2834",
      title: "Multiple login failures",
      category: "Authentication",
      age: "12 min ago",
      severity: "Medium",
      state: "New",
      asset: "VPN-GW-01",
      score: 63,
      user: "m.chen",
      ip: "91.214.124.11",
      mitre: "T1110",
      note:
        "Twenty-eight failed VPN authentication attempts were followed by a successful sign-in from the same source. The user normally connects from a different region.",
      next:
        "Validate successful session · Review MFA outcome · Check password-reset events · Block source if malicious",
    },
    {
      id: "ALT-2827",
      title: "Suspicious inbox rule created",
      category: "Email security",
      age: "18 min ago",
      severity: "High",
      state: "New",
      asset: "EXO-MAIL",
      score: 76,
      user: "l.hayes",
      ip: "45.95.147.32",
      mitre: "T1114.003",
      note:
        "A new inbox rule forwards finance-related messages externally and deletes the source copy. The action followed an unfamiliar sign-in.",
      next:
        "Disable rule · Review sign-in history · Reset credentials · Search for related forwarding rules",
    },
    {
      id: "ALT-2819",
      title: "Known scanner activity",
      category: "Network detection",
      age: "34 min ago",
      severity: "Medium",
      state: "Closed",
      asset: "WEB-DMZ-02",
      score: 41,
      user: "n/a",
      ip: "10.10.2.40",
      mitre: "T1595",
      note:
        "Connection pattern matched the approved weekly vulnerability scan. Source, target scope, and maintenance window were verified against the change record.",
      next: "No further action · Retain event with change record reference",
    },
  ];

  let selectedId = alerts[0].id;
  let activeFilter = "All";

  const list = dashboard.querySelector("[data-alert-list]");
  const filters = dashboard.querySelectorAll("[data-filter]");
  const investigateButton = dashboard.querySelector('[data-action="investigate"]');
  const closeButton = dashboard.querySelector('[data-action="close"]');

  const detailFields = {
    id: dashboard.querySelector("[data-detail-id]"),
    title: dashboard.querySelector("[data-detail-title]"),
    subtitle: dashboard.querySelector("[data-detail-subtitle]"),
    score: dashboard.querySelector("[data-detail-score]"),
    user: dashboard.querySelector("[data-evidence-user]"),
    ip: dashboard.querySelector("[data-evidence-ip]"),
    asset: dashboard.querySelector("[data-evidence-asset]"),
    mitre: dashboard.querySelector("[data-evidence-mitre]"),
    note: dashboard.querySelector("[data-detail-note]"),
    next: dashboard.querySelector("[data-detail-next]"),
  };

  const selectedAlert = () => alerts.find((alert) => alert.id === selectedId);

  const filteredAlerts = () =>
    alerts.filter((alert) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "Critical") return alert.severity === "Critical";
      return alert.state === activeFilter;
    });

  const updateMetrics = () => {
    const open = alerts.filter((alert) => alert.state !== "Closed");
    const critical = open.filter((alert) => alert.severity === "Critical");
    dashboard.querySelector("[data-metric-open]").textContent = String(open.length).padStart(2, "0");
    dashboard.querySelector("[data-metric-critical]").textContent = String(critical.length).padStart(2, "0");
    dashboard.querySelector("[data-open-count]").textContent = open.length;
  };

  const updateDetail = () => {
    const alert = selectedAlert();
    if (!alert) return;
    detailFields.id.textContent = alert.id;
    detailFields.title.textContent = alert.title;
    detailFields.subtitle.textContent = `${alert.category} · ${alert.age}`;
    detailFields.score.textContent = alert.score;
    detailFields.score.setAttribute("aria-label", `Risk score ${alert.score}`);
    detailFields.user.textContent = alert.user;
    detailFields.ip.textContent = alert.ip;
    detailFields.asset.textContent = alert.asset;
    detailFields.mitre.textContent = alert.mitre;
    detailFields.note.textContent = alert.note;
    detailFields.next.textContent = alert.next;
    investigateButton.disabled = alert.state !== "New";
    investigateButton.textContent = alert.state === "Investigating" ? "Investigation active" : "Start investigation";
    closeButton.disabled = alert.state === "Closed";
    closeButton.textContent = alert.state === "Closed" ? "Alert closed" : "Close alert";
  };

  const renderList = () => {
    const visible = filteredAlerts();
    if (!visible.some((alert) => alert.id === selectedId) && visible.length) {
      selectedId = visible[0].id;
    }

    list.innerHTML = "";
    if (!visible.length) {
      const empty = document.createElement("p");
      empty.className = "empty-alerts";
      empty.textContent = "No alerts match this filter.";
      list.append(empty);
      return;
    }

    visible.forEach((alert) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `alert-item${alert.id === selectedId ? " selected" : ""}`;
      button.setAttribute("aria-label", `${alert.severity} alert: ${alert.title}, ${alert.state}`);
      button.innerHTML = `
        <span><i class="severity-pill severity-${alert.severity.toLowerCase()}">${alert.severity}</i></span>
        <span class="alert-name">${alert.title}</span>
        <span>${alert.asset}</span>
        <span><i class="state-pill state-${alert.state.toLowerCase()}">${alert.state === "Investigating" ? "In review" : alert.state}</i></span>
      `;
      button.addEventListener("click", () => {
        selectedId = alert.id;
        renderList();
        updateDetail();
      });
      list.append(button);
    });

    updateDetail();
  };

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      activeFilter = filter.dataset.filter;
      filters.forEach((item) => item.classList.toggle("active", item === filter));
      renderList();
    });
  });

  investigateButton.addEventListener("click", () => {
    const alert = selectedAlert();
    if (alert && alert.state === "New") {
      alert.state = "Investigating";
      updateMetrics();
      renderList();
    }
  });

  closeButton.addEventListener("click", () => {
    const alert = selectedAlert();
    if (alert && alert.state !== "Closed") {
      alert.state = "Closed";
      updateMetrics();
      renderList();
    }
  });

  updateMetrics();
  renderList();
}
