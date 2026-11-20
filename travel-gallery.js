(function(root){
  'use strict';
  const visible=(photos,category)=>category==='all'?photos.slice():photos.filter(photo=>photo.category===category);
  function open(photos,id,category){
    const pool=visible(photos,category),index=pool.findIndex(photo=>photo.id===id);
    return index<0?null:{photos:pool,index};
  }
  function move(state,delta){
    if(!state||!state.photos.length)return null;
    return {photos:state.photos,index:((state.index+delta)%state.photos.length+state.photos.length)%state.photos.length};
  }
  const current=state=>state&&state.photos[state.index]||null;
  const model={visible,open,move,current};
  if(typeof module==='object'&&module.exports)module.exports=model;
  else root.TopazGallery=model;
  if(typeof document==='undefined')return;
  const gallery=document.querySelector('[data-photo-gallery]');
  if(!gallery)return;
  const tiles=Array.from(gallery.querySelectorAll('[data-gallery-item]'));
  const photos=tiles.map(tile=>({id:tile.dataset.photoId,category:tile.dataset.category,
    src:tile.querySelector('a').href,alt:tile.querySelector('img').alt,
    title:tile.querySelector('[data-photo-title]').textContent}));
  let category='all',state=null,returnTo=null;
  const filters=document.querySelector('[data-photo-filters]');
  const count=document.querySelector('[data-photo-count]');
  if(filters){
    filters.hidden=false;
    filters.addEventListener('click',event=>{
      const button=event.target.closest('button[data-category]');if(!button)return;
      category=button.dataset.category;
      filters.querySelectorAll('button').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
      tiles.forEach(tile=>{tile.hidden=category!=='all'&&tile.dataset.category!==category;});
      const length=visible(photos,category).length;
      count.textContent=length+' '+(length===1?'photo':'photos');
    });
  }
  const dialog=document.querySelector('[data-photo-dialog]');
  if(!dialog||typeof dialog.showModal!=='function')return;
  const image=dialog.querySelector('img'),caption=dialog.querySelector('[data-viewer-caption]');
  const position=dialog.querySelector('[data-viewer-position]');
  const previous=dialog.querySelector('[data-previous]'),next=dialog.querySelector('[data-next]');
  function render(){
    const photo=current(state);if(!photo)return;
    image.src=photo.src;image.alt=photo.alt;caption.textContent=photo.title;
    position.textContent=(state.index+1)+' of '+state.photos.length+' photos';
    previous.disabled=next.disabled=state.photos.length<2;
  }
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[data-open-photo]');
    if(!link||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    const selected=open(photos,link.dataset.openPhoto,link.dataset.photoScope==='all'?'all':category);
    if(!selected)return;
    event.preventDefault();state=selected;returnTo=link;render();dialog.showModal();
    document.documentElement.classList.add('viewer-open');
  });
  previous.addEventListener('click',()=>{state=move(state,-1);render();});
  next.addEventListener('click',()=>{state=move(state,1);render();});
  dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  dialog.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
      event.preventDefault();state=move(state,event.key==='ArrowLeft'?-1:1);render();
    }
  });
  dialog.addEventListener('close',()=>{
    document.documentElement.classList.remove('viewer-open');
    image.removeAttribute('src');state=null;
    if(returnTo&&returnTo.isConnected)returnTo.focus();
  });
})(typeof globalThis==='undefined'?this:globalThis);
