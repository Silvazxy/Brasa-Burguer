// Personalize aqui: altere o WhatsApp e os produtos para os dados reais da sua hamburgueria.
const WHATSAPP_NUMBER = "5511942218112"; // DDI + DDD + número, somente dígitos.

const products = [
  {id:1,name:"Brasa Clássico",category:"burgers",price:29.90,description:"Pão brioche, burger 160g, queijo cheddar, alface e molho da casa.",badge:"MAIS PEDIDO",image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=85"},
  {id:2,name:"Cheddar Bacon",category:"burgers",price:34.90,description:"Burger 160g, cheddar cremoso, bacon crocante e cebola caramelizada.",badge:"QUERIDINHO",image:"https://s2.glbimg.com/J37rcGJSqqOBHXy7PtN1JGOCgww=/620x455/e.glbimg.com/og/ed/f/original/2020/09/03/bacon_burger_-_01.jpg"},
  {id:3,name:"Duplo Braseiro",category:"burgers",price:39.90,description:"Dois burgers 120g, queijo prato em dobro e maionese defumada.",badge:"PRA MATAR A FOME",image:"https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=85"},
  {id:4,name:"Chicken Crispy",category:"burgers",price:31.90,description:"Frango empanado crocante, queijo, alface e maionese de ervas.",badge:"CROCANTE",image:"https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=700&q=85"},
  {id:5,name:"Combo Brasa",category:"combos",price:44.90,description:"Brasa Clássico + batata P + refrigerante lata.",badge:"VALE A PENA",image:"https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=700&q=85"},
  {id:6,name:"Combo Duplo",category:"combos",price:59.90,description:"Dois burgers clássicos + batata grande + 2 bebidas.",badge:"PRA DIVIDIR",image:"https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=700&q=85"},
  {id:7,name:"Batata da Casa",category:"acompanhamentos",price:16.90,description:"Batatas crocantes com páprica e toque especial da casa.",badge:"",image:"https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=700&q=85"},
  {id:8,name:"Onion Rings",category:"acompanhamentos",price:18.90,description:"Anéis de cebola empanados, sequinhos e crocantes.",badge:"",image:"https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=700&q=85"},
  {id:9,name:"Refrigerante Lata",category:"bebidas",price:6.00,description:"Lata 350ml. Consulte os sabores disponíveis.",badge:"GELADINHO",image:"https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=700&q=85"},
  {id:10,name:"Milk-shake",category:"bebidas",price:17.90,description:"Cremoso, 400ml. Consulte os sabores disponíveis.",badge:"",image:"https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=85"}
];

const money = value => value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const grid = document.getElementById("productGrid");
const cart = new Map();
let activeCategory = "todos";
let searchTerm = "";

function renderProducts(){
  const visible = products.filter(p => (activeCategory==="todos" || p.category===activeCategory) && (p.name+" "+p.description).toLowerCase().includes(searchTerm));
  grid.innerHTML = visible.length ? visible.map(p => `
    <article class="product-card">
      <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/700x500/eee8df/24211d?text=Brasa+Burger'">${p.badge?`<span class="product-badge">${p.badge}</span>`:""}</div>
      <div class="product-info"><div class="product-top"><h3>${p.name}</h3><span class="product-price">${money(p.price)}</span></div>
      <p>${p.description}</p><div class="product-bottom"><small>✦ Feito na hora</small><button class="add-btn" data-add="${p.id}" aria-label="Adicionar ${p.name}">+</button></div></div>
    </article>`).join("") : `<div class="no-results">Não encontramos esse item. Que tal tentar outra busca?</div>`;
}
function renderCart(){
  const entries = [...cart.entries()];
  const quantity = entries.reduce((sum,[,item])=>sum+item.qty,0);
  const total = entries.reduce((sum,[,item])=>sum+item.qty*item.product.price,0);
  document.getElementById("cartCount").textContent = quantity;
  document.getElementById("drawerCount").textContent = `(${quantity})`;
  document.getElementById("cartTotal").textContent = money(total);
  document.getElementById("cartFooter").hidden = !quantity;
  document.getElementById("cartItems").innerHTML = quantity ? entries.map(([id,item])=>`
    <div class="cart-row"><div><h4>${item.product.name}</h4><small>${money(item.product.price)} cada</small>
      <div class="qty-controls"><button data-qty="${id}" data-change="-1" aria-label="Diminuir">−</button><span>${item.qty}</span><button data-qty="${id}" data-change="1" aria-label="Aumentar">+</button></div></div>
      <strong>${money(item.product.price*item.qty)}</strong></div>`).join("") : `<div class="empty-cart"><span>🍔</span><h4>Seu carrinho está vazio</h4><p>Escolha seu burger favorito e vem ser feliz.</p><button class="btn btn-primary" id="browseMenu">Ver cardápio</button></div>`;
}
function addToCart(id){
  const product=products.find(p=>p.id===id); if(!product)return;
  const current=cart.get(id); cart.set(id,{product,qty:(current?.qty||0)+1});
  renderCart(); showToast(`${product.name} adicionado ao pedido!`);
}
function showToast(message){const toast=document.getElementById("toast");toast.textContent=message;toast.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2100)}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("cartOverlay").classList.add("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","false")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("cartOverlay").classList.remove("open");document.getElementById("cartDrawer").setAttribute("aria-hidden","true")}
function checkout(){
  if(!cart.size)return;
  const lines=[ "Olá! Quero fazer este pedido na Brasa Burger:", "", ...[...cart.values()].map(i=>`${i.qty}x ${i.product.name} — ${money(i.product.price*i.qty)}`), "", `*Subtotal: ${money([...cart.values()].reduce((s,i)=>s+i.qty*i.product.price,0))}*`, "", "Pode me passar as opções de entrega e pagamento?" ];
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`,"_blank","noopener");
}
document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]"); if(add)addToCart(Number(add.dataset.add));
  const qty=e.target.closest("[data-qty]"); if(qty){const id=Number(qty.dataset.qty),item=cart.get(id);if(item){item.qty+=Number(qty.dataset.change);if(item.qty<=0)cart.delete(id);renderCart()}}
  if(e.target.closest("#browseMenu")){closeCart();document.getElementById("cardapio").scrollIntoView({behavior:"smooth"})}
});
document.getElementById("filters").addEventListener("click",e=>{const btn=e.target.closest("[data-category]");if(!btn)return;activeCategory=btn.dataset.category;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===btn));renderProducts()});
document.getElementById("searchInput").addEventListener("input",e=>{searchTerm=e.target.value.trim().toLowerCase();renderProducts()});
document.getElementById("openCart").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("cartOverlay").addEventListener("click",closeCart);
document.getElementById("checkoutBtn").addEventListener("click",checkout);
document.getElementById("themeToggle").addEventListener("click",()=>{const dark=document.documentElement.dataset.theme!=="dark";document.documentElement.dataset.theme=dark?"dark":"light";document.getElementById("themeToggle").textContent=dark?"☾":"☼";localStorage.setItem("brasa-theme",dark?"dark":"light")});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("mainNav").classList.toggle("open"));
document.querySelectorAll(".main-nav a").forEach(a=>a.addEventListener("click",()=>document.getElementById("mainNav").classList.remove("open")));
document.getElementById("contactWhatsapp").href=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Olá! Gostaria de conhecer o cardápio da Brasa Burger.")}`;
document.getElementById("year").textContent=new Date().getFullYear();
const savedTheme=localStorage.getItem("brasa-theme");if(savedTheme){document.documentElement.dataset.theme=savedTheme;document.getElementById("themeToggle").textContent=savedTheme==="dark"?"☾":"☼"}
renderProducts();renderCart();
