(function(){
  'use strict';
  const menus=Array.from(document.querySelectorAll('.mobile-menu'));
  function close(){menus.forEach(menu=>{menu.open=false;});}
  document.addEventListener('click',event=>{
    menus.forEach(menu=>{
      if(!menu.contains(event.target)||event.target.closest('a'))menu.open=false;
    });
  });
  document.addEventListener('keydown',event=>{
    if(event.key!=='Escape')return;
    const menu=menus.find(item=>item.open);
    if(menu){close();menu.querySelector('summary').focus();}
  });
  window.addEventListener('pageshow',close);
})();
