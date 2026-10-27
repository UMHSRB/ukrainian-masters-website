(function(){
  function send(name,params){ if(typeof gtag==='function'){ gtag('event',name,Object.assign({transport_type:'beacon',page_path:location.pathname},params||{})); } }
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a,button'); if(!a) return;
    var href=a.getAttribute('href')||'';
    if(href.indexOf('tel:')===0) send('call_click',{link_url:href});
    else if(href.indexOf('sms:')===0) send('sms_click',{link_url:href});
    else if(href.indexOf('mailto:')===0) send('email_click',{link_url:href});
    else if(href.indexOf('g.page/')>-1||href.indexOf('google.com/maps')>-1) send('google_review_click',{link_url:href});
    else if(href.indexOf('thumbtack.com')>-1) send('thumbtack_click',{link_url:href});
    if(a.id==='calc-go'){ var s=document.getElementById('calc-service'); send('calculator_use',{service:s?s.value:''}); }
    if(a.id==='calc-send'){ var s2=document.getElementById('calc-service'); send('calculator_request',{service:s2?s2.value:''}); }
    if(a.closest&&a.closest('a.svc')) send('service_card_click',{link_url:href});
  },true);
  document.addEventListener('submit',function(e){
    var f=e.target; if(!(f&&f.classList&&f.classList.contains('estimate-form'))) return;
    var s=document.getElementById('service'); send('form_submit',{service:s?s.value:''});
    try{sessionStorage.setItem('um_lead_ts',String(Date.now()));}catch(err){}
    if(!window.fetch||!window.FormData) return;
    e.preventDefault();
    var btn=f.querySelector('button[type=submit],input[type=submit]'); if(btn) btn.disabled=true;
    fetch(f.action,{method:'POST',body:new FormData(f),headers:{'Accept':'application/json'}})
      .then(function(r){ if(r.ok){ location.href='/thank-you/'; } else { f.submit(); } })
      .catch(function(){ f.submit(); });
  },true);
})();
