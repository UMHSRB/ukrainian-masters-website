(function(){
  var RATES={
    furniture:{one:65,two:110,min:2},
    wallpaper:{one:85,two:150},
    tv:{s:85,m:100,l:120},
    paint:300
  };
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
    if(s==='furniture'){
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
  svc.addEventListener('change',calc);
  document.querySelectorAll('#calculator input,#calculator select').forEach(function(i){i.addEventListener('input',calc);i.addEventListener('change',calc);});
  el('calc-form').addEventListener('click',function(e){ if(e.target&&e.target.id==='calc-send'){toForm(e);} });
  calc();
})();
