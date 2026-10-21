(function(){
  var RATES={
    furniture:{one:65,two:110,min:2},
    wallpaper:{one:85,two:150},
    tv:{s:85,m:100,l:120},
    paint:300
  };
  var MINVISIT=120; // minimum visit for by-item pricing
  var LIMIT=1000; // above this we ask for a call to review the scope
  var el=function(id){return document.getElementById(id);};
  var svc=el('calc-service'); if(!svc) return;
  var groups={furniture:el('calc-furniture'),tv:el('calc-tv'),paint:el('calc-paint'),wallpaper:el('calc-wallpaper'),other:el('calc-other')};
  var out=el('calc-result'), note=el('calc-note'), actions=el('calc-actions');
  var lastText='';

  function num(id,def){var v=parseFloat(el(id).value);return isFinite(v)&&v>0?v:def;}
  function money(n){return '$'+Math.round(n).toLocaleString('en-US');}

  function calc(){
    var s=svc.value, total=0, from=false, label='', detail='';
    Object.keys(groups).forEach(function(k){groups[k].hidden=(k!==s);});
    var byItem=(el('calc-f-mode').value==='item'); el('calc-f-items').hidden=!byItem; el('calc-f-hourly').hidden=byItem;
    if(s==='furniture' && el('calc-f-mode').value==='item'){
      var lo=0,hi=0,plus=false,count=0;
      document.querySelectorAll('#calc-f-items input').forEach(function(i){
        var q=Math.max(0,Math.round(parseFloat(i.value)||0)); if(!q) return;
        count+=q; lo+=q*(+i.dataset.lo); hi+=q*(+i.dataset.hi); if(i.dataset.plus==='1') plus=true;
      });
      if(!count){ out.textContent='Add your items'; note.textContent='Enter how many of each piece you need assembled.'; lastText='Hi, I would like a quote for furniture assembly.'; link(); return; }
      lo=Math.max(lo,MINVISIT); hi=Math.max(hi,MINVISIT);
      label='Furniture assembly'; detail=count+' item'+(count>1?'s':'');
      if(hi>LIMIT){
        out.textContent='Call us to review the job';
        note.textContent='For larger projects we first go over the scope together, so please call or text.';
        lastText='Hi, I would like a quote: '+label+' ('+detail+').'; link(); return;
      }
      out.textContent=(lo===hi?money(lo):money(lo)+'\u2013'+money(hi))+(plus?'+':'');
      note.textContent=detail+'. Typical range; the final price depends on the model and difficulty. Minimum visit '+money(MINVISIT)+'.';
      lastText='Hi, I would like to book: '+label+' ('+detail+'), estimate '+out.textContent+'.';
      link(); return;
    } else if(s==='furniture'){
      var w=el('calc-f-workers').value, h=Math.max(num('calc-f-hours',2),RATES.furniture.min);
      total=(w==='2'?RATES.furniture.two:RATES.furniture.one)*h;
      label='Furniture assembly';
      detail=(w==='2'?'2 workers':'1 worker')+', '+h+' hours (2-hour minimum)';
    } else if(s==='tv'){
      var size=el('calc-tv-size').value, q=Math.max(1,Math.round(num('calc-tv-qty',1)));
      total=RATES.tv[size]*q; from=(size==='l');
      label='TV mounting';
      detail=q+' TV'+(q>1?'s':'')+', '+({s:'up to 55″',m:'55–65″',l:'over 65″'})[size];
    } else if(s==='paint'){
      var r=Math.max(1,Math.round(num('calc-rooms',1)));
      total=RATES.paint*r; from=true;
      label='Interior painting';
      detail=r+' room'+(r>1?'s':'')+', patching and ceilings not included';
    } else if(s==='wallpaper'){
      var ww=el('calc-w-workers').value, hh=num('calc-w-hours',2);
      total=(ww==='2'?RATES.wallpaper.two:RATES.wallpaper.one)*hh; from=true;
      label='Wallpaper hanging';
      detail=(ww==='2'?'2 workers':'1 worker')+', '+hh+' hours';
    } else {
      out.textContent='Call or text for a quote';
      note.textContent='Other jobs are priced by the job. A photo helps.';
      lastText='Hi, I would like a quote for a job.';
      link();return;
    }
    if(total>LIMIT){
      out.textContent='Call us to review the job';
      note.textContent='For larger projects we first go over the scope together, so please call or text.';
      lastText='Hi, I would like a quote: '+label+' ('+detail+').';
    } else {
      out.textContent=(from?'from ':'')+money(total);
      note.textContent=detail+'. This is an estimate; the final price is confirmed before we start.';
      lastText='Hi, I would like to book: '+label+' ('+detail+'), estimate '+(from?'from ':'')+money(total)+'.';
    }
    link();
  }
  function link(){
    el('calc-sms').href='sms:+13109164906?&body='+encodeURIComponent(lastText);
  }
  function toForm(e){
    e.preventDefault();
    var map={furniture:'Furniture assembly',tv:'TV mounting',paint:'House painting',wallpaper:'Wallpaper hanging/removal',other:'Other / not sure'};
    var f=el('service'); if(f){f.value=map[svc.value]||'Other / not sure';}
    var m=el('message'); if(m){m.value=lastText;}
    var c=el('contact'); if(c){c.scrollIntoView({behavior:'smooth'});}
  }
  var go=el('calc-go');
  if(go){go.addEventListener('click',function(){
    calc();
    var r=el('calc-result');
    if(window.matchMedia('(max-width:760px)').matches){r.scrollIntoView({behavior:'smooth',block:'center'});}
  });}
  svc.addEventListener('change',calc);
  document.querySelectorAll('#calculator input,#calculator select').forEach(function(i){i.addEventListener('input',calc);i.addEventListener('change',calc);});
  el('calc-form').addEventListener('click',function(e){ if(e.target&&e.target.id==='calc-send'){toForm(e);} });
  calc();
})();
