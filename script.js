const products=[
 {name:'Golden Pearl Earrings',category:'Earrings',price:'$48.00',desc:'Luminous freshwater pearls on 18k gold vermeil.',image:'images/earrings-1.jpg'},
 {name:'Elegant Stone Necklace',category:'Necklaces',price:'$86.00',desc:'A delicate chain finished with a champagne stone.',image:'images/necklace-1.jpg'},
 {name:'Minimal Gold Bracelet',category:'Bracelets',price:'$54.00',desc:'A barely-there everyday essential in polished gold.',image:'images/bracelet-1.jpg'},
 {name:'Crystal Signet Ring',category:'Rings',price:'$42.00',desc:'A softly sculptural ring with a crystal centre.',image:'images/rings-1.jpg'},
 {name:'Pearl Jewellery Set',category:'Sets',price:'$112.00',desc:'A timeless necklace and earring pairing for occasions.',image:'images/jewellery-set-1.jpg'},
 {name:'Sculptural Gold Hoops',category:'Earrings',price:'$39.00',desc:'Polished curves made for a little daily drama.',image:'images/earrings-1.jpg'},
 {name:'Fine Chain Layer',category:'Necklaces',price:'$68.00',desc:'The perfect foundation for your personal stack.',image:'images/necklace-1.jpg'},
 {name:'Fashion Bangles',category:'Bracelets',price:'$45.00',desc:'A softly hammered trio with a warm golden finish.',image:'images/bracelet-1.jpg'},
 ];
const grid=document.querySelector('#productGrid');let cart=0;
function render(filter='All'){grid.innerHTML=products.filter(p=>filter==='All'||p.category===filter).map((p,i)=>`<article class="product-card"><div class="product-image"><img loading="lazy" src="${p.image}" alt="${p.name}"></div><div class="product-info"><p class="product-category">${p.category}</p><h3>${p.name}</h3><p class="product-desc">${p.desc}</p><div class="product-footer"><span class="price">${p.price}</span><div><button class="wishlist" aria-label="Add to wishlist">♡</button><button class="add-to-cart" aria-label="Add to cart">+</button></div></div></article>`).join('')+`<div id="productGrid"></div>`;attachCardEvents()}
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600)}
function attachCardEvents(){document.querySelectorAll('.wishlist').forEach(b=>b.onclick=()=>{b.classList.toggle('loved');b.textContent=b.classList.contains('loved')?'♥':'♡';toast(b.classList.contains('loved')?'Added to wishlist':'Removed from wishlist')}),document.querySelectorAll('.add-to-cart').forEach(b=>b.onclick=()=>{cart++,toast(`Added to cart (${cart})`)})}
render();
document.querySelectorAll('.filter-tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.filter-tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render(b.dataset.filter)});
document.querySelectorAll('.category-card').forEach(card=>card.onclick=()=>{const filter=card.dataset.filter;document.querySelectorAll('.filter-tabs button').forEach(x=>x.classList.toggle('active',x.dataset.filter===filter));render(filter)});
document.querySelector('.menu-toggle').onclick=()=>document.querySelector('.mobile-nav').classList.toggle('open');document.querySelector('.search-toggle').onclick=()=>{const p=document.querySelector('.search-panel');p.classList.toggle('open'),p.classList.contains('open')&&document.querySelector('#searchInput').focus()};
