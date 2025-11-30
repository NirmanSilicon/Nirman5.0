// This is the 

(function(){
  // helper to set active nav link
  function setActiveNav(){
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(a=>{
      const href = a.getAttribute('href') || '';
      if(href.endsWith(path) || (href === 'index.html' && path === 'index.html')) {
        a.classList.add('active');
      } else a.classList.remove('active');
    });
  }
  // run on load
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();

  function init(){
    setActiveNav();
    attachChatbot();
    attachThemeToggle();
    setupRoleBasedUI();
    runPageScripts();
    // smooth anchor
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', e=>{
        e.preventDefault();
        document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'});
      });
    });
  }
  
  // Role-based UI setup
  function setupRoleBasedUI(){
    const userRole = localStorage.getItem('userRole') || 'farmer';
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Show landing page if not logged in
    const landingContent = document.getElementById('landing-content');
    const farmerContent = document.getElementById('farmer-content');
    const customerContent = document.getElementById('customer-content');
    
    if(!isLoggedIn){
      // Show landing page, hide role-specific content
      if(landingContent) landingContent.style.display = 'block';
      if(farmerContent) farmerContent.style.display = 'none';
      if(customerContent) customerContent.style.display = 'none';
      // Show default navigation
      return;
    }
    
    // Hide landing page, show role-specific content
    if(landingContent) landingContent.style.display = 'none';
    
    // Update navigation based on role
    updateNavigation(userRole, isLoggedIn);
    
    // Show/hide content based on role
    if(farmerContent){
      farmerContent.style.display = userRole === 'farmer' ? 'block' : 'none';
    }
    if(customerContent){
      customerContent.style.display = userRole === 'customer' ? 'block' : 'none';
    }
  }
  
  function updateNavigation(userRole, isLoggedIn){
    const nav = document.querySelector('.nav');
    if(!nav) return;
    
    // Store theme toggle
    const themeToggle = nav.querySelector('#theme-toggle');
    const toggleHTML = themeToggle ? themeToggle.outerHTML : '';
    
    // Clear all nav items
    nav.innerHTML = '';
    
    if(userRole === 'farmer'){
      // Farmer navigation
      const links = [
        '<a href="index.html">Home</a>',
        '<a href="marketplace.html">Marketplace</a>',
        '<a href="community.html">Community</a>',
        '<a href="learning.html">Learning Hub</a>',
        '<a href="collab.html">Collab</a>',
        '<a href="mandi.html">Mandi Locator</a>',
        toggleHTML,
        isLoggedIn ? '<a href="#" onclick="logout()" style="background:transparent;border:1px solid rgba(47,142,68,0.12);padding:8px 12px;border-radius:8px;color:var(--primary)">Logout</a>' : '<a href="auth.html" style="background:transparent;border:1px solid rgba(47,142,68,0.12);padding:8px 12px;border-radius:8px;color:var(--primary)">Sign in</a>'
      ];
      links.forEach(html => nav.insertAdjacentHTML('beforeend', html));
    } else {
      // Customer navigation
      const links = [
        '<a href="index.html">Home</a>',
        '<a href="customer-shop.html">Shop</a>',
        '<a href="orders.html">My Orders</a>',
        '<a href="cart.html">Cart <span id="cart-count" style="background:#2563eb;color:white;border-radius:10px;padding:2px 6px;font-size:11px;margin-left:4px">0</span></a>',
        '<a href="wishlist.html">Wishlist</a>',
        toggleHTML,
        isLoggedIn ? '<a href="#" onclick="logout()" style="background:transparent;border:1px solid rgba(37,99,235,0.12);padding:8px 12px;border-radius:8px;color:#2563eb">Logout</a>' : '<a href="auth.html" style="background:transparent;border:1px solid rgba(37,99,235,0.12);padding:8px 12px;border-radius:8px;color:#2563eb">Sign in</a>'
      ];
      links.forEach(html => nav.insertAdjacentHTML('beforeend', html));
    }
    
    // Re-attach theme toggle
    if(themeToggle){
      attachThemeToggle();
    }
    
    setActiveNav();
  }
  
  // Logout function
  window.logout = function(){
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    location.href = 'index.html';
  };

  // Attach theme toggle behavior
  function attachThemeToggle(){
    const toggle = document.getElementById('theme-toggle');
    if(!toggle) return;

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleIcon(savedTheme);

    toggle.addEventListener('click', ()=>{
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateToggleIcon(newTheme);
    });
  }

  function updateToggleIcon(theme){
    const toggle = document.getElementById('theme-toggle');
    if(!toggle) return;
    toggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // Attach chatbot behavior
  function attachChatbot(){
    const chatBtn = document.getElementById('chat-btn');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');

    if(!chatBtn || !chatWindow) return;

    chatBtn.addEventListener('click', ()=> chatWindow.style.display = 'flex');
    chatClose.addEventListener('click', ()=> chatWindow.style.display = 'none');
    chatSend && chatSend.addEventListener('click', sendMessage);
    chatInput && chatInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') sendMessage(); });

    // Pre Message 
    appendBot("Namaste! I am Arnak, your AI farming assistant. How can I help you today?");
    function appendBot(text){
      if(!chatBody) return;
      const d = document.createElement('div'); d.className='bot-msg'; d.textContent = text;
      chatBody.appendChild(d); chatBody.scrollTop = chatBody.scrollHeight;
    }
    function appendUser(text){
      if(!chatBody) return;
      const d = document.createElement('div'); d.className='user-msg'; d.textContent = text;
      chatBody.appendChild(d); chatBody.scrollTop = chatBody.scrollHeight;
    }

    function sendMessage(){
      const v = chatInput.value && chatInput.value.trim();
      if(!v) return;
      appendUser(v);
      chatInput.value = '';
      // simulate thinking
      const loading = document.createElement('div'); loading.className = 'bot-msg'; loading.textContent='Typing...'; chatBody.appendChild(loading); chatBody.scrollTop = chatBody.scrollHeight;
      setTimeout(()=>{
        loading.remove();
        const lower = v.toLowerCase();
        let res = window.AGRI.CHAT_RESPONSES.default;
        if(lower.includes('pest')||lower.includes('insect')||lower.includes('bug')) res = window.AGRI.CHAT_RESPONSES.pest;
        else if(lower.includes('crop')||lower.includes('plant')||lower.includes('sow')) res = window.AGRI.CHAT_RESPONSES.crop;
        else if(lower.includes('price')||lower.includes('rate')||lower.includes('cost')) res = window.AGRI.CHAT_RESPONSES.price;
        appendBot(res);
      }, 900);
    }
  }

  // Page-specific scripts (chart placeholders, lists)
  function runPageScripts(){
    const page = location.pathname.split('/').pop() || 'index.html';
    if(page === '' || page === 'index.html'){
      renderPriceToday();
      renderCommunityTeasers();
    }
    if(page === 'marketplace.html'){
      renderMarketplace();
      attachSearchMarketplace();
    }
    if(page === 'community.html'){
      renderCommunityFeed();
      attachCreatePost();
    }
    if(page === 'learning.html'){
      renderLearning();
    }
    if(page === 'mandi.html'){
      attachMandiSearch();
    }
    if(page === 'auth.html'){
      attachAuthForm();
    }
  }

  /* Home: Price Today */
  function renderPriceToday(){
    const container = document.getElementById('price-container');
    if(!container) return;
    container.innerHTML = '';
    window.AGRI.VEGETABLE_PRICES.forEach(item=>{
      const diff = item.today - item.yesterday;
      const up = diff > 0;
      const percentChange = ((diff / item.yesterday) * 100).toFixed(1);
      const itemEl = document.createElement('div'); 
      itemEl.className = 'price-item';
      itemEl.style.marginBottom = '12px';
      itemEl.innerHTML = `
        <div class="meta">
          <div class="letter">${item.name[0]}</div>
          <div>
            <div style="font-weight:700;color:var(--text)">${item.name}</div>
            <div style="font-size:13px;color:var(--muted)">per ${item.unit}</div>
          </div>
        </div>
        <div class="right">
          <div style="font-weight:800;color:var(--primary);font-size:18px">₹${item.today}</div>
          <div style="font-size:12px;color:${up?'#dc2626':'#059669'};font-weight:600">${up?'↑':'↓'} ${Math.abs(percentChange)}% (${up?'+':''}₹${Math.abs(diff)})</div>
        </div>
      `;
      container.appendChild(itemEl);
    });

    // Enhanced Pie Chart with Labels and Bar Chart
    const chart = document.getElementById('price-chart');
    const legend = document.getElementById('pie-legend');
    if(chart && legend){
      chart.innerHTML = '';
      legend.innerHTML = '';
      
      const prices = window.AGRI.VEGETABLE_PRICES;
      
      // Calculate variance percentages and prepare data
      const varianceData = prices.map((p, i) => {
        const diff = p.today - p.yesterday;
        const variance = Math.abs(diff);
        const variancePercent = (variance / p.yesterday) * 100;
        const isUp = diff > 0;
        return {
          name: p.name,
          today: p.today,
          yesterday: p.yesterday,
          diff: diff,
          variance: variancePercent,
          isUp: isUp,
          percentage: 0, // Will calculate based on market share
          color: ['#2f8e44', '#2ba14a', '#34d399', '#10b981', '#059669', '#047857'][i % 6]
        };
      });
      
      // Calculate total market value for pie chart
      const totalValue = varianceData.reduce((sum, d) => sum + d.today, 0);
      varianceData.forEach(d => {
        d.percentage = (d.today / totalValue) * 100;
      });
      
      // Sort by variance for better visualization
      varianceData.sort((a, b) => b.variance - a.variance);
      
      // Create enhanced pie chart using SVG with labels
      const size = 320;
      const radius = size / 2 - 20;
      const centerX = size / 2;
      const centerY = size / 2;
      
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      svg.style.maxWidth = '100%';
      svg.style.height = 'auto';
      svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
      
      let currentAngle = -Math.PI / 2; // Start from top
      const totalMarketValue = varianceData.reduce((sum, d) => sum + d.today, 0);
      
      varianceData.forEach((data, index) => {
        const sliceAngle = (data.today / totalMarketValue) * 2 * Math.PI;
        const endAngle = currentAngle + sliceAngle;
        const midAngle = currentAngle + sliceAngle / 2;
        
        // Create path for pie slice
        const x1 = centerX + radius * Math.cos(currentAngle);
        const y1 = centerY + radius * Math.sin(currentAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);
        
        const largeArc = sliceAngle > Math.PI ? 1 : 0;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const pathData = [
          `M ${centerX} ${centerY}`,
          `L ${x1} ${y1}`,
          `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
          'Z'
        ].join(' ');
        
        path.setAttribute('d', pathData);
        path.setAttribute('fill', data.color);
        path.setAttribute('stroke', 'var(--card)');
        path.setAttribute('stroke-width', '3');
        path.style.cursor = 'pointer';
        path.style.transition = 'opacity 0.2s ease';
        path.setAttribute('opacity', '0.9');
        
        path.addEventListener('mouseenter', function(){
          this.setAttribute('opacity', '1');
          this.setAttribute('stroke-width', '4');
        });
        path.addEventListener('mouseleave', function(){
          this.setAttribute('opacity', '0.9');
          this.setAttribute('stroke-width', '3');
        });
        
        svg.appendChild(path);
        
        // Add text labels on pie slices (only if slice is large enough)
        if (sliceAngle > 0.3) {
          const labelRadius = radius * 0.7;
          const labelX = centerX + labelRadius * Math.cos(midAngle);
          const labelY = centerY + labelRadius * Math.sin(midAngle);
          
          // Commodity name
          const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          nameText.setAttribute('x', labelX);
          nameText.setAttribute('y', labelY - 6);
          nameText.setAttribute('text-anchor', 'middle');
          nameText.setAttribute('fill', 'white');
          nameText.setAttribute('font-size', '12');
          nameText.setAttribute('font-weight', '700');
          nameText.setAttribute('style', 'text-shadow: 0 1px 2px rgba(0,0,0,0.5);');
          nameText.textContent = data.name;
          svg.appendChild(nameText);
          
          // Percentage
          const percentText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          percentText.setAttribute('x', labelX);
          percentText.setAttribute('y', labelY + 8);
          percentText.setAttribute('text-anchor', 'middle');
          percentText.setAttribute('fill', 'white');
          percentText.setAttribute('font-size', '11');
          percentText.setAttribute('font-weight', '600');
          percentText.setAttribute('style', 'text-shadow: 0 1px 2px rgba(0,0,0,0.5);');
          percentText.textContent = `${data.percentage.toFixed(1)}%`;
          svg.appendChild(percentText);
        } else {
          // For small slices, add label outside
          const labelRadius = radius + 15;
          const labelX = centerX + labelRadius * Math.cos(midAngle);
          const labelY = centerY + labelRadius * Math.sin(midAngle);
          
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', centerX + radius * Math.cos(midAngle));
          line.setAttribute('y1', centerY + radius * Math.sin(midAngle));
          line.setAttribute('x2', labelX);
          line.setAttribute('y2', labelY);
          line.setAttribute('stroke', data.color);
          line.setAttribute('stroke-width', '2');
          svg.appendChild(line);
          
          const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          nameText.setAttribute('x', labelX);
          nameText.setAttribute('y', labelY - 4);
          nameText.setAttribute('text-anchor', Math.cos(midAngle) > 0 ? 'start' : 'end');
          nameText.setAttribute('fill', 'var(--text)');
          nameText.setAttribute('font-size', '11');
          nameText.setAttribute('font-weight', '600');
          nameText.textContent = `${data.name} (${data.percentage.toFixed(1)}%)`;
          svg.appendChild(nameText);
        }
        
        // Create detailed legend item with bar chart
        const legendItem = document.createElement('div');
        legendItem.style.display = 'flex';
        legendItem.style.alignItems = 'center';
        legendItem.style.gap = '12px';
        legendItem.style.padding = '10px 14px';
        legendItem.style.borderRadius = '10px';
        legendItem.style.background = 'var(--card)';
        legendItem.style.border = `2px solid ${data.color}40`;
        legendItem.style.cursor = 'pointer';
        legendItem.style.transition = 'all 0.2s ease';
        legendItem.style.marginBottom = '8px';
        
        // Mini bar chart in legend
        const barWidth = 60;
        const barHeight = 30;
        const maxPrice = Math.max(...varianceData.map(d => Math.max(d.today, d.yesterday)));
        const todayBarHeight = (data.today / maxPrice) * barHeight;
        const yesterdayBarHeight = (data.yesterday / maxPrice) * barHeight;
        
        const miniChart = document.createElement('div');
        miniChart.style.width = `${barWidth}px`;
        miniChart.style.height = `${barHeight}px`;
        miniChart.style.position = 'relative';
        miniChart.style.display = 'flex';
        miniChart.style.alignItems = 'flex-end';
        miniChart.style.gap = '4px';
        miniChart.innerHTML = `
          <div style="width:28px;height:${yesterdayBarHeight}px;background:${data.color}60;border-radius:4px 4px 0 0;position:relative" title="Yesterday: ₹${data.yesterday}">
            <div style="position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);font-size:9px;color:var(--muted);white-space:nowrap">Yest</div>
          </div>
          <div style="width:28px;height:${todayBarHeight}px;background:${data.color};border-radius:4px 4px 0 0;position:relative" title="Today: ₹${data.today}">
            <div style="position:absolute;bottom:-18px;left:50%;transform:translateX(-50%);font-size:9px;color:var(--text);font-weight:600;white-space:nowrap">Today</div>
          </div>
        `;
        
        legendItem.innerHTML = `
          <div style="display:flex;flex-direction:column;gap:4px;min-width:80px">
            <div style="display:flex;align-items:center;gap:6px">
              <div style="width:14px;height:14px;border-radius:3px;background:${data.color}"></div>
              <div style="font-size:14px;font-weight:700;color:var(--text)">${data.name}</div>
            </div>
            <div style="font-size:12px;color:var(--muted)">₹${data.today}/${prices.find(p => p.name === data.name).unit}</div>
            <div style="font-size:11px;color:${data.isUp ? '#dc2626' : '#059669'};font-weight:600">
              ${data.isUp ? '↑' : '↓'} ${data.variance.toFixed(1)}% (${data.isUp ? '+' : ''}₹${Math.abs(data.diff)})
            </div>
          </div>
        `;
        legendItem.appendChild(miniChart);
        
        legendItem.addEventListener('mouseenter', function(){
          this.style.background = `${data.color}15`;
          this.style.borderColor = data.color;
          this.style.transform = 'translateX(4px)';
        });
        legendItem.addEventListener('mouseleave', function(){
          this.style.background = 'var(--card)';
          this.style.borderColor = `${data.color}40`;
          this.style.transform = 'translateX(0)';
        });
        
        legend.appendChild(legendItem);
        
        currentAngle = endAngle;
      });
      
      chart.appendChild(svg);
      
      // Enhanced center text with statistics
      const centerText = document.createElement('div');
      centerText.style.position = 'absolute';
      centerText.style.top = '50%';
      centerText.style.left = '50%';
      centerText.style.transform = 'translate(-50%, -50%)';
      centerText.style.textAlign = 'center';
      centerText.style.pointerEvents = 'none';
      centerText.style.background = 'var(--card)';
      centerText.style.borderRadius = '50%';
      centerText.style.width = '120px';
      centerText.style.height = '120px';
      centerText.style.display = 'flex';
      centerText.style.flexDirection = 'column';
      centerText.style.alignItems = 'center';
      centerText.style.justifyContent = 'center';
      centerText.style.border = '3px solid var(--border)';
      centerText.innerHTML = `
        <div style="font-size:16px;font-weight:700;color:var(--text);margin-bottom:4px">Market</div>
        <div style="font-size:20px;font-weight:800;color:var(--primary)">₹${totalMarketValue}</div>
        <div style="font-size:11px;color:var(--muted);margin-top:4px">Total Value</div>
      `;
      chart.appendChild(centerText);
    }
  }

  /* Home: Community teasers */
  function renderCommunityTeasers(){
    const cont = document.getElementById('community-teasers');
    if(!cont) return;
    cont.innerHTML = '';
    window.AGRI.COMMUNITY_POSTS.slice(0,3).forEach(post=>{
      const el = document.createElement('div'); el.className='post card';
      el.innerHTML = `
        <div class="post-header">
          <div class="avatar"><img src="${post.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:999px" /></div>
          <div>
            <div style="font-weight:700">${post.user}</div>
            <div style="font-size:12px;color:var(--muted)">${post.time}</div>
          </div>
        </div>
        <img class="post-image" src="${post.image}" alt="post" />
        <div class="post-body">
          <div style="font-weight:700;margin-bottom:6px">${post.likes} likes</div>
          <div style="font-size:14px">${post.caption}</div>
        </div>
      `;
      cont.appendChild(el);
    });
  }

  /* Marketplace */
  function renderMarketplace(filter='all'){
    const grid = document.getElementById('market-grid');
    if(!grid) return;
    grid.innerHTML = '';
    
    let items = window.AGRI.MARKETPLACE_LISTINGS;
    if(filter !== 'all'){
      items = items.filter(item => item.category === filter);
    }
    
    if(items.length === 0){
      grid.innerHTML = '<div class="card" style="text-align:center;padding:48px;grid-column:1/-1"><div style="font-size:48px;margin-bottom:16px">🔍</div><h3 style="color:var(--text)">No items found</h3><p style="color:var(--muted)">Try a different filter</p></div>';
      return;
    }
    
    items.forEach(item=>{
      const card = document.createElement('div'); card.className='card';
      
      card.innerHTML = `
        <div style="position:relative;overflow:hidden;border-radius:10px;height:160px">
          <img src="${item.image}" style="width:100%;height:100%;object-fit:cover" />
          <div style="position:absolute;right:10px;top:10px;background:rgba(255,255,255,0.9);padding:6px 8px;border-radius:8px;font-weight:700;font-size:12px">${item.grade}</div>
        </div>
        <div style="padding-top:12px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
            <div style="flex:1">
              <div style="font-weight:800;font-size:16px;color:var(--text)">${item.crop}</div>
              <div style="font-size:13px;color:var(--muted);margin-top:4px">📍 ${item.location}</div>
              ${item.farmer ? `<div style="font-size:12px;color:var(--muted);margin-top:2px">👤 ${item.farmer}</div>` : ''}
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div>
              <div style="font-weight:900;color:var(--primary);font-size:20px">₹${item.price}</div>
              <div style="font-size:12px;color:var(--muted)">per ${item.unit}</div>
            </div>
            <div style="font-size:12px;color:var(--muted)">Available: ${item.quantity} ${item.unit}</div>
          </div>
          <div style="margin-top:10px;display:flex;gap:8px">
            <button class="btn" onclick="viewDetails(${item.id})" style="flex:1;background:var(--bg);border-radius:8px;border:1px solid var(--border);color:var(--text);padding:10px">View</button>
            <button class="btn" onclick="purchaseItem(${item.id})" style="flex:1;background:var(--primary);color:white;border-radius:8px;padding:10px;font-weight:600">Buy Now</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }
  
  function viewDetails(id){
    const item = window.AGRI.MARKETPLACE_LISTINGS.find(i=>i.id===id);
    if(item){
      alert(`Details for ${item.crop}\nPrice: ₹${item.price}/${item.unit}\nLocation: ${item.location}\n${item.farmer ? 'Farmer: ' + item.farmer : ''}`);
    }
  }
  
  function purchaseItem(id){
    const item = window.AGRI.MARKETPLACE_LISTINGS.find(i=>i.id===id);
    if(item){
      alert(`Purchase ${item.crop}\nPrice: ₹${item.price}\nProceeding to checkout...`);
    }
  }

  function attachSearchMarketplace(){
    const form = document.getElementById('market-search-form');
    if(!form) return;
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';
    
    filterButtons.forEach(btn=>{
      btn.addEventListener('click', function(){
        filterButtons.forEach(b=>{
          b.classList.remove('active');
          b.style.background = 'var(--card)';
          b.style.color = 'var(--text)';
        });
        this.classList.add('active');
        this.style.background = 'var(--primary)';
        this.style.color = 'white';
        currentFilter = this.dataset.filter;
        renderMarketplace(currentFilter);
      });
    });
    
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const q = (document.getElementById('market-search')||{}).value.toLowerCase();
      if(!q){
        renderMarketplace(currentFilter);
        return;
      }
      
      let items = window.AGRI.MARKETPLACE_LISTINGS;
      if(currentFilter !== 'all'){
        items = items.filter(item => item.category === currentFilter);
      }
      
      const filtered = items.filter(item=> 
        item.crop.toLowerCase().includes(q) || 
        item.location.toLowerCase().includes(q) ||
        (item.farmer && item.farmer.toLowerCase().includes(q))
      );
      
      renderMarketplaceWithItems(filtered.length ? filtered : items);
    });
  }
  
  function renderMarketplaceWithItems(items){
      const grid = document.getElementById('market-grid');
    if(!grid) return;
      grid.innerHTML = '';
    
    items.forEach(item=>{
        const card = document.createElement('div'); card.className='card';
      
        card.innerHTML = `
          <div style="position:relative;overflow:hidden;border-radius:10px;height:160px">
            <img src="${item.image}" style="width:100%;height:100%;object-fit:cover" />
          <div style="position:absolute;right:10px;top:10px;background:rgba(255,255,255,0.9);padding:6px 8px;border-radius:8px;font-weight:700;font-size:12px">${item.grade}</div>
          </div>
          <div style="padding-top:12px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
            <div style="flex:1">
              <div style="font-weight:800;font-size:16px;color:var(--text)">${item.crop}</div>
              <div style="font-size:13px;color:var(--muted);margin-top:4px">📍 ${item.location}</div>
              ${item.farmer ? `<div style="font-size:12px;color:var(--muted);margin-top:2px">👤 ${item.farmer}</div>` : ''}
              </div>
            </div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div>
              <div style="font-weight:900;color:var(--primary);font-size:20px">₹${item.price}</div>
              <div style="font-size:12px;color:var(--muted)">per ${item.unit}</div>
            </div>
            <div style="font-size:12px;color:var(--muted)">Available: ${item.quantity} ${item.unit}</div>
            </div>
            <div style="margin-top:10px;display:flex;gap:8px">
            <button class="btn" onclick="viewDetails(${item.id})" style="flex:1;background:var(--bg);border-radius:8px;border:1px solid var(--border);color:var(--text);padding:10px">View</button>
            <button class="btn" onclick="purchaseItem(${item.id})" style="flex:1;background:var(--primary);color:white;border-radius:8px;padding:10px;font-weight:600">Buy Now</button>
            </div>
          </div>
        `;
        grid.appendChild(card);
    });
  }

  /* Community feed */
  function renderCommunityFeed(){
    const grid = document.getElementById('community-grid');
    if(!grid) return;
    grid.innerHTML = '';
    window.AGRI.COMMUNITY_POSTS.forEach(post=>{
      const card = document.createElement('div'); card.className='post';
      card.innerHTML = `
        <div class="post-header">
          <div class="avatar"><img src="${post.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:999px" /></div>
          <div>
            <div style="font-weight:700">${post.user}</div>
            <div style="font-size:12px;color:var(--muted)">${post.time}</div>
          </div>
        </div>
        <img class="post-image" src="${post.image}" />
        <div class="post-body">
          <div style="display:flex;gap:10px;margin-bottom:8px">
            <button class="btn" style="background:transparent">♡</button>
            <button class="btn" style="background:transparent">💬</button>
            <button class="btn" style="background:transparent">↗</button>
          </div>
          <div style="font-weight:700">${post.likes} likes</div>
          <div style="margin-top:8px">${post.caption}</div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function attachCreatePost(){
    const form = document.getElementById('post-form');
    if(!form) return;
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const txt = (document.getElementById('post-text')||{}).value;
      if(!txt) return alert('Write something!');
      // naive add to top
      const newPost = { id:Date.now(), user:'You', avatar:'https://i.pravatar.cc/150?u=you', image:'https://images.unsplash.com/photo-1544947320-23b0f2d46cda?auto=format&fit=crop&q=80&w=1200', caption:txt, likes:0, time:'Just now' };
      window.AGRI.COMMUNITY_POSTS.unshift(newPost);
      renderCommunityFeed();
      form.reset();
      alert('Posted (local only)');
    });
  }

  /* Learning hub */
  function renderLearning(){
    const grid = document.getElementById('learning-grid');
    if(!grid) return;
    grid.innerHTML = '';
    window.AGRI.LEARNING_MODULES.forEach(m=>{
      const card = document.createElement('div'); card.className='card';
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
          <div style="width:44px;height:44px;border-radius:10px;background:var(--primary);display:flex;align-items:center;justify-content:center;color:white;font-weight:700">${m.category[0]}</div>
          <div>
            <div style="font-size:13px;font-weight:800">${m.title}</div>
            <div style="font-size:12px;color:var(--muted)">${m.category}</div>
          </div>
        </div>
        <div style="margin-top:8px">${m.description}</div>
        <div style="margin-top:12px"><button class="btn" style="background:transparent;border:1px solid rgba(15,23,42,0.05);border-radius:10px;padding:8px 12px">Start Learning</button></div>
      `;
      grid.appendChild(card);
    });
  }

  /* Mandi locator */
  function attachMandiSearch(){
    const f = document.getElementById('mandi-form');
    if(!f) return;
    f.addEventListener('submit', e=>{
      e.preventDefault();
      const q = (document.getElementById('mandi-q')||{}).value;
      if(!q) return alert('Enter location (city or village)');
      const url = `https://www.openstreetmap.org/search?query=${encodeURIComponent(q+' mandi')}`;
      window.open(url,'_blank');
    });
  }

  /* Auth */
  function attachAuthForm(){
    const f = document.getElementById('auth-form');
    if(!f) return;
    
    f.addEventListener('submit', e=>{
      e.preventDefault();
      const email = (document.getElementById('auth-email')||{}).value;
      const password = (document.getElementById('auth-password')||{}).value;
      
      if(!email) return alert('Enter email');
      if(!password) return alert('Enter password');
      
      // Check database for user's role based on email
      // In a real app, this would be an API call to your backend
      // For demo: check localStorage for existing user data
      const userData = localStorage.getItem('user_' + email);
      let userRole = 'farmer'; // default
      let userType = 'farmer'; // for database management
      
      if(userData){
        try{
          const parsed = JSON.parse(userData);
          userRole = parsed.role || parsed.userRole || 'farmer';
          userType = parsed.userType || parsed.role || 'farmer';
        } catch(e){
          // Fallback: check if userType exists in localStorage
          userType = localStorage.getItem('userType_' + email) || 'farmer';
          userRole = userType;
        }
      } else {
        // If user doesn't exist, check if there's a default role stored
        // In production, this would query your database
        userType = localStorage.getItem('userType_' + email) || 'farmer';
        userRole = userType;
      }
      
      // Save login status and role
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userType', userType); // For database management: 'farmer' or 'customer'
      
      // Demo login flow - redirect to role-specific page
      alert(`Login successful! Welcome back, ${userRole}! Redirecting...`);
      setTimeout(()=> location.href = 'index.html', 1000);
    });
    
    // Handle create account button
    const createAccountBtn = document.querySelector('.create-account-btn');
    if(createAccountBtn){
      createAccountBtn.addEventListener('click', ()=>{
        openCreateAccountModal();
      });
    }
    
    // Attach create account modal functionality
    attachCreateAccountModal();
    
    // Handle Google login
    const googleBtn = document.querySelector('.google-btn');
    if(googleBtn){
      googleBtn.addEventListener('click', ()=>{
        alert('Sign in with Google (demo). This would initiate Google OAuth and check your database for user role.');
      });
    }
  }
  
  function attachRoleToggle(){
    const authCard = document.getElementById('auth-card');
    const farmerBtn = document.getElementById('farmer-btn');
    const customerBtn = document.getElementById('customer-btn');
    
    if(!authCard || !farmerBtn || !customerBtn) return;
    
    // Set default role to farmer
    authCard.setAttribute('data-role', 'farmer');
    
    farmerBtn.addEventListener('click', ()=>{
      authCard.setAttribute('data-role', 'farmer');
      farmerBtn.classList.add('active');
      customerBtn.classList.remove('active');
    });
    
    customerBtn.addEventListener('click', ()=>{
      authCard.setAttribute('data-role', 'customer');
      customerBtn.classList.add('active');
      farmerBtn.classList.remove('active');
    });
  }
  
  function openCreateAccountModal(){
    const modal = document.getElementById('create-account-modal');
    const createCard = document.getElementById('create-account-card');
    
    if(!modal || !createCard) return;
    
    // Default to farmer role
    createCard.setAttribute('data-role', 'farmer');
    
    // Set radio button to farmer by default
    const joinFarmer = document.getElementById('join-farmer');
    const joinCustomer = document.getElementById('join-customer');
    if(joinFarmer) joinFarmer.checked = true;
    if(joinCustomer) joinCustomer.checked = false;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
  
  function closeCreateAccountModal(){
    const modal = document.getElementById('create-account-modal');
    if(!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
    
    // Reset form
    const form = document.getElementById('create-account-form');
    if(form) form.reset();
    
    // Reset photo preview
    const photoPreview = document.getElementById('photo-preview');
    const photoPlaceholder = document.getElementById('photo-placeholder');
    if(photoPreview) photoPreview.style.display = 'none';
    if(photoPlaceholder) photoPlaceholder.style.display = 'block';
    
    // Hide OTP section
    const otpSection = document.getElementById('otp-section');
    if(otpSection) otpSection.style.display = 'none';
  }
  
  function attachCreateAccountModal(){
    const modal = document.getElementById('create-account-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const cancelBtn = document.getElementById('cancel-create');
    const createCard = document.getElementById('create-account-card');
    const form = document.getElementById('create-account-form');
    const photoInput = document.getElementById('photo-input');
    const sendOtpBtn = document.getElementById('send-otp-btn');
    const joinFarmer = document.getElementById('join-farmer');
    const joinCustomer = document.getElementById('join-customer');
    const createPassword = document.getElementById('create-password');
    const reenterPassword = document.getElementById('reenter-password');
    const passwordMatch = document.getElementById('password-match');
    
    if(!modal) return;
    
    // Close modal handlers
    if(modalOverlay) modalOverlay.addEventListener('click', closeCreateAccountModal);
    if(modalClose) modalClose.addEventListener('click', closeCreateAccountModal);
    if(cancelBtn) cancelBtn.addEventListener('click', closeCreateAccountModal);
    
    // Role switching in modal
    if(joinFarmer){
      joinFarmer.addEventListener('change', ()=>{
        if(joinFarmer.checked && createCard){
          createCard.setAttribute('data-role', 'farmer');
        }
      });
    }
    
    if(joinCustomer){
      joinCustomer.addEventListener('change', ()=>{
        if(joinCustomer.checked && createCard){
          createCard.setAttribute('data-role', 'customer');
        }
      });
    }
    
    // Photo upload preview
    if(photoInput){
      photoInput.addEventListener('change', (e)=>{
        const file = e.target.files[0];
        if(file){
          const reader = new FileReader();
          reader.onload = (e)=>{
            const photoPreview = document.getElementById('photo-preview');
            const photoPlaceholder = document.getElementById('photo-placeholder');
            if(photoPreview){
              photoPreview.src = e.target.result;
              photoPreview.style.display = 'block';
            }
            if(photoPlaceholder) photoPlaceholder.style.display = 'none';
          };
          reader.readAsDataURL(file);
        }
      });
    }
    
    // OTP sending
    if(sendOtpBtn){
      sendOtpBtn.addEventListener('click', ()=>{
        const emailPhone = document.getElementById('create-email-phone');
        if(!emailPhone || !emailPhone.value.trim()){
          alert('Please enter email or phone number');
          return;
        }
        
        // Disable button and show loading
        sendOtpBtn.disabled = true;
        sendOtpBtn.textContent = 'Sending...';
        
        // Simulate OTP sending
        setTimeout(()=>{
          sendOtpBtn.disabled = false;
          sendOtpBtn.textContent = 'Resend OTP';
          const otpSection = document.getElementById('otp-section');
          if(otpSection) otpSection.style.display = 'block';
          alert('OTP sent successfully! (Demo: Use 123456)');
        }, 1500);
      });
    }
    
    // Password matching validation
    if(createPassword && reenterPassword && passwordMatch){
      function checkPasswordMatch(){
        if(reenterPassword.value){
          if(createPassword.value === reenterPassword.value){
            passwordMatch.textContent = '✓ Passwords match';
            passwordMatch.className = 'match';
            passwordMatch.style.display = 'block';
          } else {
            passwordMatch.textContent = '✗ Passwords do not match';
            passwordMatch.className = 'mismatch';
            passwordMatch.style.display = 'block';
          }
        } else {
          passwordMatch.style.display = 'none';
        }
      }
      
      createPassword.addEventListener('input', checkPasswordMatch);
      reenterPassword.addEventListener('input', checkPasswordMatch);
    }
    
    // Form submission
    if(form){
      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        
        const name = document.getElementById('create-name')?.value;
        const dobDay = document.getElementById('dob-day')?.value;
        const dobMonth = document.getElementById('dob-month')?.value;
        const dobYear = document.getElementById('dob-year')?.value;
        const emailPhone = document.getElementById('create-email-phone')?.value;
        const otp = document.getElementById('create-otp')?.value;
        const password = document.getElementById('create-password')?.value;
        const reenter = document.getElementById('reenter-password')?.value;
        const role = createCard?.getAttribute('data-role') || 'farmer';
        
        // Validation
        if(!name) return alert('Please enter your name');
        if(!dobDay || !dobMonth || !dobYear) return alert('Please enter date of birth');
        if(!emailPhone) return alert('Please enter email or phone');
        if(!otp) return alert('Please enter OTP');
        if(otp !== '123456') return alert('Invalid OTP. Use 123456 for demo.');
        if(!password) return alert('Please enter password');
        if(password !== reenter) return alert('Passwords do not match');
        if(password.length < 6) return alert('Password must be at least 6 characters');
        
        // Get selected role from radio buttons
        const selectedRole = document.querySelector('input[name="join-as"]:checked')?.value || role;
        const userType = selectedRole; // For database management: 'farmer' or 'customer'
        
        // Save user data to database (localStorage for demo)
        // In production, this would be an API call to your backend
        const userData = {
          name: name,
          email: emailPhone,
          dob: `${dobDay}/${dobMonth}/${dobYear}`,
          role: selectedRole,
          userType: userType, // For database management - distinguishes farmer IDs from customer IDs
          createdAt: new Date().toISOString()
        };
        
        // Store user data with email as key for easy lookup
        localStorage.setItem('user_' + emailPhone, JSON.stringify(userData));
        localStorage.setItem('userType_' + emailPhone, userType); // For quick database lookup
        
        // Save user role and login status
        localStorage.setItem('userRole', selectedRole);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', emailPhone);
        localStorage.setItem('userType', userType); // For database management
        
        // Success - redirect to role-specific page
        alert(`Account created successfully as ${selectedRole}! Your account type (${userType}) has been saved to the database. Redirecting...`);
        setTimeout(()=>{
          closeCreateAccountModal();
          location.href = 'index.html';
        }, 1000);
      });
    }
  }

})();
