/* ---------- optional cloud sign-in ----------
   Sign-in is entirely optional. Guests use Ripple fully from localStorage,
   exactly as before. Signing in just lets a garden follow someone across
   devices. The anon key below is safe to ship in the browser only because
   Supabase row level security restricts every row to its own owner (see
   the setup guide). Never put the service role key here or in the repo. */
const SUPABASE_URL="https://pfglxxydmxnvcyjapjte.supabase.co";
const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmZ2x4eHlkbXhudmN5amFwanRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM1MzQyMzEsImV4cCI6MjEwOTExMDIzMX0.M-OemMsV449NXbNYhip6_e4NM8KzdAZcp3QDYZCG6Bc";
const sb=(SUPABASE_URL&&SUPABASE_ANON_KEY&&window.supabase)?window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;

/* ---------- characters ---------- */
function moss(){return `<svg viewBox="0 0 120 100" aria-label="Moss the turtle" role="img"><ellipse cx="58" cy="90" rx="42" ry="6" fill="currentColor" opacity=".10"/><ellipse cx="30" cy="80" rx="13" ry="7" fill="#7CC4A0"/><ellipse cx="84" cy="80" rx="13" ry="7" fill="#7CC4A0"/><circle cx="97" cy="52" r="16" fill="#8FD3B0"/><circle cx="100" cy="47" r="3.4" fill="#163330"/><circle cx="101.2" cy="45.8" r="1.1" fill="#fff"/><path d="M94 57 q5 4.5 10 0" stroke="#163330" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="106" cy="54" r="2.6" fill="#E8705E" opacity=".55"/><path d="M14 74 Q16 26 56 24 Q92 26 92 74 Z" fill="#258773"/><path d="M40 46 l9-7 h13 l9 7 -4 12 h-23z" fill="#3FA88F"/><path d="M22 66 l6-12 h10 l4 12z M72 66 l4-12 h8 l4 12z" fill="#3FA88F"/><path d="M10 74 h86" stroke="#1D6B5B" stroke-width="6" stroke-linecap="round"/></svg>`}
function juno(){return `<svg viewBox="0 0 120 100" aria-label="Juno the otter" role="img"><ellipse cx="60" cy="94" rx="36" ry="5" fill="currentColor" opacity=".10"/><ellipse cx="60" cy="70" rx="31" ry="25" fill="#9A6B4F"/><ellipse cx="60" cy="74" rx="20" ry="17" fill="#E9CDAE"/><circle cx="41" cy="20" r="6.5" fill="#7E5640"/><circle cx="79" cy="20" r="6.5" fill="#7E5640"/><circle cx="60" cy="38" r="24" fill="#9A6B4F"/><ellipse cx="60" cy="47" rx="15" ry="11" fill="#E9CDAE"/><circle cx="51" cy="35" r="3.4" fill="#2B1E17"/><circle cx="69" cy="35" r="3.4" fill="#2B1E17"/><circle cx="52.2" cy="33.8" r="1.1" fill="#fff"/><circle cx="70.2" cy="33.8" r="1.1" fill="#fff"/><ellipse cx="60" cy="43" rx="4.2" ry="3" fill="#2B1E17"/><path d="M55 49 q5 4 10 0" stroke="#2B1E17" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M47 46 l-10 -2 M47 49 l-10 2 M73 46 l10 -2 M73 49 l10 2" stroke="#7E5640" stroke-width="1.4" stroke-linecap="round"/><path d="M60 82 c-9-6 -12-12 -7-15 c3-2 6 0 7 2 c1-2 4-4 7-2 c5 3 2 9 -7 15z" fill="#E8705E"/><ellipse cx="47" cy="72" rx="7" ry="5" fill="#7E5640"/><ellipse cx="73" cy="72" rx="7" ry="5" fill="#7E5640"/></svg>`}
function penny(){return `<svg viewBox="0 0 120 100" aria-label="Penny the bee" role="img"><defs><clipPath id="beeb"><ellipse cx="58" cy="62" rx="34" ry="26"/></clipPath></defs><ellipse cx="58" cy="94" rx="34" ry="5" fill="currentColor" opacity=".10"/><ellipse cx="44" cy="28" rx="13" ry="19" fill="#D3ECF7" stroke="#A8D2E6" stroke-width="2" transform="rotate(-22 44 28)"/><ellipse cx="66" cy="26" rx="12" ry="18" fill="#D3ECF7" stroke="#A8D2E6" stroke-width="2" transform="rotate(16 66 26)"/><ellipse cx="58" cy="62" rx="34" ry="26" fill="#EFAE34"/><g clip-path="url(#beeb)" fill="#3A2A1C"><rect x="30" y="30" width="9" height="70"/><rect x="48" y="30" width="9" height="70"/></g><path d="M22 64 l-9 2 9 3z" fill="#3A2A1C"/><circle cx="80" cy="56" r="3.6" fill="#2B1E17"/><circle cx="81.3" cy="54.7" r="1.2" fill="#fff"/><path d="M76 66 q6 5 12 0" stroke="#2B1E17" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="88" cy="62" r="2.6" fill="#E8705E" opacity=".55"/><path d="M78 38 q2 -12 10 -16 M86 42 q6 -10 14 -10" stroke="#3A2A1C" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="88" cy="22" r="3" fill="#3A2A1C"/><circle cx="100" cy="32" r="3" fill="#3A2A1C"/></svg>`}
const CAST={planet:{name:"Moss",svg:moss,label:"Planet"},people:{name:"Juno",svg:juno,label:"People"},prosperity:{name:"Penny",svg:penny,label:"Prosperity"}};

/* ---------- tree / pond scene ---------- */
function treeSVG(L,opts={}){
  const vb=opts.mini?'90 40 140 110':'0 0 320 180';
  const trunk=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${w/2}" fill="var(--bark)"/>`;
  const cloud=(x,y,k)=>`<g fill="#fff" opacity=".9"><circle cx="${x}" cy="${y}" r="${9*k}"/><circle cx="${x+12*k}" cy="${y-5*k}" r="${12*k}"/><circle cx="${x+26*k}" cy="${y}" r="${9*k}"/><rect x="${x}" y="${y}" width="${26*k}" height="${9*k}" rx="${4*k}"/></g>`;
  const fish=(x,y,k)=>`<g transform="translate(${x} ${y}) scale(${k})"><ellipse rx="7" ry="3.6" fill="#F08A4B"/><path d="M6 0 l6 -4 v8z" fill="#F08A4B"/><circle cx="-3.5" cy="-1" r=".9" fill="#163330"/></g>`;
  const fly=(x,y,c)=>`<g transform="translate(${x} ${y})"><ellipse cx="-3" rx="3.2" ry="4.6" fill="${c}" transform="rotate(-20)"/><ellipse cx="3" rx="3.2" ry="4.6" fill="${c}" transform="rotate(20)"/><rect x="-.6" y="-4" width="1.2" height="8" rx=".6" fill="#163330"/></g>`;
  const bird=(x,y,c)=>`<g transform="translate(${x} ${y})"><path d="M-6 1 l-6 2 6 1z" fill="${c}"/><ellipse rx="7" ry="5" fill="${c}"/><circle cx="5" cy="-4" r="3.6" fill="${c}"/><path d="M8.4 -4.4 l4 1 -4 1z" fill="#EFAE34"/><circle cx="6" cy="-4.8" r="1" fill="#fff"/></g>`;
  let g="";
  if(L>=7) g+=[["#E8705E",150],["#EFAE34",141],["#5CB979",132],["#4FA3D9",123]].map(([c,r])=>`<path d="M${160-r} 150 A ${r} ${r*0.82} 0 0 1 ${160+r} 150" fill="none" stroke="${c}" stroke-width="7" opacity=".28"/>`).join("");
  if(L===0) g+=`<g opacity=".55" fill="#9AA6A2"><circle cx="58" cy="36" r="11"/><circle cx="73" cy="30" r="15"/><circle cx="90" cy="36" r="11"/><rect x="50" y="36" width="48" height="10" rx="5"/></g>`;
  if(L>=1){g+=`<g opacity="${L===1?.45:1}"><circle cx="282" cy="32" r="15" fill="var(--sun)"/>`;if(L>=2)g+=`<g stroke="var(--sun)" stroke-width="3" stroke-linecap="round">`+[0,45,90,135,180,225,270,315].map(d=>{const r=d*Math.PI/180;return `<line x1="${(282+21*Math.cos(r)).toFixed(1)}" y1="${(32+21*Math.sin(r)).toFixed(1)}" x2="${(282+27*Math.cos(r)).toFixed(1)}" y2="${(32+27*Math.sin(r)).toFixed(1)}"/>`}).join("")+`</g>`;g+=`</g>`}
  if(L>=4) g+=cloud(34,32,1);
  if(L>=6) g+=cloud(196,24,.75)+`<g fill="none" stroke="#163330" stroke-width="2" stroke-linecap="round" opacity=".55"><path d="M112 30 q5 -5 10 0 q5 -5 10 0"/><path d="M140 16 q4 -4 8 0 q4 -4 8 0"/></g>`;
  g+=`<ellipse cx="160" cy="152" rx="152" ry="26" fill="${L>=2?"var(--pond)":"var(--murky)"}"/>
  <ellipse class="rip" cx="160" cy="150" rx="128" ry="20" fill="none" stroke="${L>=2?"var(--pond2)":"var(--murky2)"}" stroke-width="2"/>
  <ellipse class="rip" cx="160" cy="148" rx="100" ry="15" fill="none" stroke="${L>=2?"var(--pond2)":"var(--murky2)"}" stroke-width="2"/>`;
  if(L===0) g+=`<g opacity=".75" fill="#AEB8B4"><rect x="66" y="152" width="15" height="6" rx="3" transform="rotate(-12 73 155)"/><rect x="240" y="157" width="8" height="5" rx="1.5"/></g>`;
  if(L>=3) g+=fish(92,161,1);
  if(L>=6) g+=fish(232,163,.9)+fish(256,151,.7);
  if(L>=5) g+=`<ellipse cx="54" cy="158" rx="10" ry="3.5" fill="var(--leaf2)"/><circle cx="57" cy="156" r="2.6" fill="#F4A6C6"/><ellipse cx="270" cy="149" rx="8" ry="3" fill="var(--leaf2)"/>`;
  g+=`<ellipse cx="160" cy="140" rx="${L>=5?98:70}" ry="${L>=5?17:15}" fill="var(--grass)"/>`;
  if(L===0) g+=`<ellipse cx="160" cy="134" rx="8" ry="5.5" fill="var(--bark)"/><path d="M160 129 q2 -6 6 -7" stroke="var(--leaf2)" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  if(L===1) g+=`<path d="M160 136 V110" stroke="var(--leaf)" stroke-width="4" stroke-linecap="round"/><ellipse cx="150" cy="110" rx="11" ry="6" fill="var(--leaf2)" transform="rotate(-25 150 110)"/><ellipse cx="170" cy="106" rx="12" ry="6.5" fill="var(--leaf)" transform="rotate(25 170 106)"/>`;
  if(L===2) g+=trunk(156,92,8,46)+`<circle cx="160" cy="84" r="24" fill="var(--leaf)"/><circle cx="148" cy="78" r="13" fill="var(--leaf2)"/>`;
  if(L>=5) g+=trunk(104,110,6,28)+`<circle cx="107" cy="104" r="15" fill="var(--leaf2)"/><circle cx="102" cy="100" r="3" fill="#E8503A"/>`+trunk(214,112,6,26)+`<circle cx="217" cy="106" r="13" fill="var(--leaf2)"/><circle cx="222" cy="103" r="3" fill="#F2A33A"/>`;
  if(L>=3) g+=trunk(153,78,14,60)+`<circle cx="160" cy="66" r="34" fill="var(--leaf)"/><circle cx="136" cy="78" r="20" fill="var(--leaf)"/><circle cx="184" cy="78" r="20" fill="var(--leaf)"/><circle cx="146" cy="56" r="16" fill="var(--leaf2)"/><circle cx="178" cy="60" r="11" fill="var(--leaf2)"/>`;
  const FR=[[170,76],[142,84],[160,50],[180,64],[136,66],[152,74],[190,82],[128,82],[167,38],[146,44],[196,70],[174,92]];
  const nf=[0,0,0,3,7,10,12,12][Math.min(L,7)];
  g+=FR.slice(0,nf).map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="4.2" fill="${i%2?"#F2A33A":"#E8503A"}"/><path d="M${x} ${y-4} l1.5 -2.5" stroke="var(--bark)" stroke-width="1.2"/>`).join("");
  const FL=[[126,140],[196,141],[182,137],[140,144],[112,142],[208,139],[90,139],[232,142]];
  const nfl=[0,0,2,3,4,6,8,8][Math.min(L,7)],FC=["var(--sun)","var(--coral)","#F4A6C6","#B48CE0"];
  g+=FL.slice(0,nfl).map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="3.2" fill="${FC[i%4]}"/><circle cx="${x}" cy="${y}" r="1.2" fill="#fff"/>`).join("");
  if(L>=4) g+=bird(200,42,"#4F7BD9")+fly(100,116,"#B48CE0");
  if(L>=6) g+=fly(232,96,"#F4A6C6");
  if(L>=7) g+=bird(110,92,"#E8705E");
  if(L>=5) g+=`<g transform="translate(46 84) scale(.22)">${penny().replace(/<\/?svg[^>]*>/g,"")}</g>`;
  return `<svg viewBox="${vb}" aria-hidden="true">${g}</svg>`;
}
const LEVELS=[0,15,40,80,140,220,320,450];
const LEVEL_NAMES=["A seed","A sprout","A sapling","A young tree","A fruiting tree","A little grove","A thriving garden","A flourishing island"];
function treeLevel(seeds){let l=0;LEVELS.forEach((t,i)=>{if(seeds>=t)l=i});return l}

/* ---------- content ---------- */
const STAGES=[
  {name:"Seed",line:"Every big tree starts here. We’ll keep things small and easy, with no rush at all."},
  {name:"Sprout",line:"You’ve already got some good habits growing. We’ll suggest a few easy next ones."},
  {name:"Sapling",line:"You do a lot already. When you feel like it, we’ll show you a few bigger ideas."},
  {name:"Grove",line:"You’re deep into this. We’ll open up the bigger switches and ways to help others."}
];
const CATS={all:"All",food:"Food",move:"Getting around",home:"Home",shop:"Shopping",people:"People & community"};
const EFFORT=["","Easy","Takes a little planning","A bigger step"];
const SWITCHES=[
 {id:"veg-meal",title:"Have a vegetarian meal instead of a meat one",how:"Two a week is a lovely start. Lentil curry, veggie pasta or a falafel wrap all count.",cat:"food",pillar:"planet",effort:1,stage:0,per:"per meal",impact:{co2:1.5},note:"Compared with a chicken meal. Swapping out a beef meal saves closer to 6.5 kg (ADEME estimates)."},
 {id:"bar-soap",title:"Use bar soap instead of body wash",how:"One bar lasts roughly as long as a bottle and comes wrapped in paper, or nothing at all.",cat:"home",pillar:"planet",effort:1,stage:0,per:"per day",impact:{plastic:1},note:"A body wash bottle is roughly 25–30 g of plastic and lasts about a month."},
 {id:"tap-water",title:"Refill a bottle with tap water",how:"Tap water in France is safe and closely monitored. Carry a bottle you actually like.",cat:"food",pillar:"planet",effort:1,stage:0,per:"per refill",impact:{plastic:15,eur:0.5},note:"Assumes you’d otherwise buy a 50 cl plastic bottle on the go."},
 {id:"short-shower",title:"Take a shower one minute shorter",how:"Play one song fewer, or turn the water off while you lather.",cat:"home",pillar:"planet",effort:1,stage:0,per:"per shower",impact:{water:10},note:"A typical shower head runs about 8–12 litres a minute."},
 {id:"wash-30",title:"Wash clothes at 30 °C",how:"Most everyday laundry comes out just as clean. Keep hotter washes for towels and bedding.",cat:"home",pillar:"planet",effort:1,stage:0,per:"per load",impact:{kwh:0.3},note:"Uses up to around 40% less energy than a 40 °C wash, since most of the energy goes into heating water."},
 {id:"unplug",title:"Switch devices off at the plug at night",how:"A power strip with a switch makes it one click for the TV, console and chargers.",cat:"home",pillar:"prosperity",effort:1,stage:0,per:"per night",impact:{kwh:0.1},note:"Standby power is small per device but adds up across a home over a year."},
 {id:"food-waste",title:"Cook with what’s already in the fridge",how:"Before shopping, make one meal from leftovers. Omelettes, soups and fried rice are great for this.",cat:"food",pillar:"prosperity",effort:1,stage:0,per:"per meal",impact:{eur:2},note:"A rough estimate of food saved. Wasted food carries all the emissions of growing and moving it, for nothing."},
 {id:"walk-bike",title:"Walk or cycle a short trip instead of driving",how:"Start with one trip you already know is under 5 km, like the bakery or the gym.",cat:"move",pillar:"planet",effort:2,stage:0,per:"per 5 km trip",impact:{co2:1,eur:0.5},note:"An average petrol car emits roughly 0.2 kg CO2e per km (ADEME)."},
 {id:"line-dry",title:"Air-dry a load instead of using the dryer",how:"A drying rack by a window works year-round, it just takes a little longer in winter.",cat:"home",pillar:"prosperity",effort:1,stage:1,per:"per load",impact:{kwh:2,eur:0.5},note:"A tumble dryer typically uses about 2–4 kWh per load."},
 {id:"seasonal",title:"Pick fruit and veg that are in season",how:"Keep a seasonal calendar on the fridge, or just ask at the market what’s fresh this week.",cat:"food",pillar:"planet",effort:1,stage:1,per:"per shop",impact:{},note:"Out-of-season produce is often grown in heated greenhouses or flown in, which can multiply its footprint."},
 {id:"local-market",title:"Buy from a local market or producer",how:"Pick one thing you buy every week and get it from a market stall or a farm shop.",cat:"shop",pillar:"prosperity",effort:1,stage:0,per:"per shop",impact:{},note:"More of what you spend stays with the people who grew or made it."},
 {id:"fair-trade",title:"Choose fair-trade coffee, tea or chocolate",how:"Look for a fair-trade label on the things you already buy.",cat:"shop",pillar:"people",effort:1,stage:0,per:"per purchase",impact:{},note:"Fair-trade schemes set minimum prices and pay premiums that farming communities invest in schools, water and health."},
 {id:"home-yogurt",title:"Make your own yogurt",how:"Warm a litre of milk, stir in a spoon of yogurt, keep it warm overnight. That’s it.",cat:"food",pillar:"planet",effort:2,stage:1,per:"per batch",impact:{plastic:20,eur:1},note:"A litre makes about the same as four small pots, so that’s four plastic pots skipped."},
 {id:"transit",title:"Take public transport instead of the car",how:"Try it for one regular journey and see how it feels.",cat:"move",pillar:"planet",effort:2,stage:1,per:"per 10 km",impact:{co2:1.8,eur:1},note:"Metro, tram and train emit a small fraction of a car’s CO2 per passenger (ADEME)."},
 {id:"secondhand",title:"Buy an item of clothing secondhand",how:"Vintage shops, charity shops and resale apps are full of great finds.",cat:"shop",pillar:"planet",effort:2,stage:1,per:"per item",impact:{co2:5},note:"Roughly what a new cotton T-shirt emits. A new pair of jeans is closer to 20 kg or more (ADEME estimates)."},
 {id:"own-container",title:"Bring your own container for takeaway",how:"Keep one box in your bag. Many places are happy to fill it.",cat:"shop",pillar:"planet",effort:2,stage:2,per:"per meal",impact:{plastic:20},note:"A typical plastic takeaway box with lid is roughly 15–30 g."},
 {id:"repair",title:"Repair something instead of replacing it",how:"Phones, shoes, small appliances. A repair café can help you do it yourself.",cat:"shop",pillar:"prosperity",effort:2,stage:2,per:"per repair",impact:{},note:"In France, the repair bonus (bonus réparation) lowers the price at certified repairers for many appliances."},
 {id:"plant-day",title:"Have a fully plant-based day",how:"Oats for breakfast, a big salad or wrap for lunch, a bean chilli for dinner.",cat:"food",pillar:"planet",effort:3,stage:2,per:"per day",impact:{co2:3},note:"A rough estimate for swapping two meat meals in a day."},
 {id:"volunteer",title:"Give an hour to a local cause",how:"Food banks, tutoring, park clean-ups. Platforms like JeVeuxAider.gouv.fr list missions near you.",cat:"people",pillar:"people",effort:3,stage:2,per:"per hour",impact:{},note:"Hard to put a number on, and that’s the point. It’s about people."},
 {id:"train-trip",title:"Take the train instead of a short flight",how:"For trips under about 5 hours by rail, the train is often door-to-door competitive.",cat:"move",pillar:"planet",effort:3,stage:3,per:"per trip",impact:{},note:"On routes like Paris to Marseille, the train emits a small fraction of the plane’s CO2 (ADEME)."}
];
const SW=Object.fromEntries(SWITCHES.map(s=>[s.id,s]));

const QUIZ=[
 {who:"planet",p:"planet",q:"How often do you eat meat?",o:[["At most meals",0,[]],["Most days",1,[]],["A few times a week",2,["veg-meal"]],["Rarely or never",3,["veg-meal","plant-day"]]]},
 {who:"planet",p:"planet",q:"How do you usually get around day to day?",o:[["Mostly by car",0,[]],["A mix of car and other things",1,[]],["Mostly public transport",2,["transit"]],["Mostly walking or cycling",3,["walk-bike","transit"]]]},
 {who:"people",p:"people",q:"When you buy coffee, chocolate or clothes, do you think about the people who made them?",sub:"Most of us don’t, because labels rarely tell us. No judgement here.",o:[["Not really",0,[]],["Sometimes",1,[]],["Often, I look for fair-trade or brands I trust",3,["fair-trade"]]]},
 {who:"prosperity",p:"prosperity",q:"Where does most of your food shopping happen?",o:[["Big supermarkets",0,[]],["A mix",1,[]],["Markets or local shops, a lot of the time",3,["local-market"]]]},
 {who:"planet",p:"planet",q:"When you need clothes, what do you usually do?",o:[["Buy new fairly often",0,[]],["Buy new now and then",1,[]],["A mix of new and secondhand",2,["secondhand"]],["Mostly secondhand, or I rarely buy",3,["secondhand"]]]},
 {who:"people",p:"people",q:"How often do you give time to a cause or your community?",sub:"Helping a neighbour or a friend’s fundraiser counts too.",o:[["Not at the moment",0,[]],["Once in a while",2,[]],["Regularly",3,["volunteer"]]]},
 {who:"prosperity",p:"prosperity",q:"When something breaks, what usually happens?",o:[["I replace it",0,[]],["Depends on what it is",1,[]],["I try to repair it first",3,["repair"]]]},
 {who:"planet",p:"planet",q:"What do you drink water from most?",o:[["Bottled water",0,[]],["A bit of both",1,[]],["Tap water or a refillable bottle",3,["tap-water"]]]},
 {who:"prosperity",p:"prosperity",q:"How much food ends up in the bin in a typical week?",o:[["A fair bit",0,[]],["Some",1,[]],["Hardly any",3,["food-waste"]]]},
 {who:"people",q:"Last one. How much room do you have for something new right now?",sub:"Every answer here is a good answer.",o:[["None really, I’m just curious",0,[],0],["A little",0,[],1],["Some",0,[],2],["Plenty",0,[],3]]}
];
const FACTS=[
 {who:"planet",q:"How much mine waste is dug up to get the gold for one wedding ring?",unit:"tonnes",min:0.1,max:100,log:true,ans:20,ansText:"About 20 tonnes",why:"That’s roughly the weight of three elephants, for a ring that weighs a few grams. Most gold ore holds only a few grams of gold per tonne of rock, and the leftover waste can carry cyanide and heavy metals.",tip:"Recycled gold, or certified gold like Fairmined, skips most of that digging.",src:"Earthworks, No Dirty Gold campaign"},
 {who:"prosperity",q:"If you melted all the gold ever mined into one cube, how wide would each side be?",unit:"metres",min:1,max:1000,log:true,ans:22,ansText:"About 22 metres",why:"All the gold in human history, around 216,000 tonnes, would fit in a cube about as tall as a seven-storey building. Roughly two thirds of it was mined after 1950.",tip:"So much gold already exists above ground that recycling could cover a big share of what we use.",src:"World Gold Council"},
 {who:"people",q:"How many children work in cocoa farming in Côte d’Ivoire and Ghana?",unit:"children",min:1000,max:10000000,log:true,ans:1560000,ansText:"About 1.56 million",why:"These two countries grow around 60% of the world’s cocoa. A large study found about 1.56 million children doing hazardous or age-inappropriate work on cocoa farms there.",tip:"Look for chocolate brands that publish where their cocoa comes from, or carry a fair-trade label.",src:"NORC at the University of Chicago (2020)"},
 {who:"planet",q:"What share of the material used to make clothes gets recycled into new clothes?",unit:"%",min:0,max:50,log:false,ans:1,ansText:"Less than 1%",why:"Most clothing ends up burned or in landfill. Blends like cotton-polyester are very hard to separate, so true clothes-to-clothes recycling is still rare.",tip:"The lowest-impact wardrobe is the one you already own. Wear it longer, then pass it on.",src:"Ellen MacArthur Foundation, A New Textiles Economy (2017)"},
 {who:"planet",q:"How much sand and gravel does the world dig up every year?",unit:"billion tonnes",min:1,max:500,log:true,ans:50,ansText:"About 50 billion tonnes",why:"After water, sand is the resource humans use most, for concrete, glass and roads. Desert sand is too smooth and round to bind well, so rivers and beaches get dredged instead. Even desert countries in the Gulf have imported sand for construction.",tip:"Renovating an old building instead of building new keeps a lot of sand in the ground.",src:"UNEP, Sand and Sustainability (2019)"},
 {who:"planet",q:"If the cement industry were a country, what share of the world’s CO2 would it emit?",unit:"%",min:0,max:30,log:false,ans:8,ansText:"About 8%",why:"That would make it the third-largest emitter on Earth, after China and the US. More than half comes from chemistry itself: heating limestone releases CO2 whatever fuel you burn.",tip:"That’s why timber buildings and low-carbon cement are such a big deal in construction right now.",src:"Chatham House, Making Concrete Change (2018)"},
 {who:"planet",q:"How many plastic drinks bottles are bought around the world every minute?",unit:"bottles",min:1000,max:100000000,log:true,ans:1000000,ansText:"About 1 million",why:"That’s well over a billion a day, and most never get recycled into new bottles.",tip:"A refillable bottle you actually like is one of the easiest switches there is.",src:"UN Environment Programme"},
 {who:"people",q:"What share of the world’s cobalt, used in phone and electric car batteries, comes from one country: the Democratic Republic of Congo?",unit:"%",min:0,max:100,log:false,ans:70,ansText:"About 70%",why:"Some of it comes from small, hand-dug mines where investigators have documented child labour and dangerous tunnels.",tip:"Keeping your phone a year longer, or buying refurbished, means fewer new batteries.",src:"US Geological Survey; Amnesty International (2016)"},
 {who:"planet",q:"The Aral Sea was once one of the four biggest lakes on Earth. How much of it has disappeared, mostly to irrigate cotton?",unit:"%",min:0,max:100,log:false,ans:90,ansText:"About 90%",why:"From the 1960s, the rivers feeding it were diverted to grow cotton in the desert. Fishing towns ended up tens of kilometres from the water, with ships left rusting in the sand.",tip:"Cotton is thirsty. Buying fewer, longer-lasting clothes eases the pressure.",src:"UNEP; NASA Earth Observatory"},
 {who:"people",q:"What share of packaged products in a typical supermarket contain palm oil?",unit:"%",min:0,max:100,log:false,ans:50,ansText:"About half",why:"Bread, biscuits, shampoo, lipstick, detergent. It hides behind dozens of label names. Palm is actually very productive per hectare, but its expansion has cleared rainforest that orangutans and Indigenous communities depend on.",tip:"Rather than avoiding it completely, look for RSPO-certified or deforestation-free sourcing.",src:"WWF"},
 {who:"prosperity",q:"How many litres of water go into one cup of coffee, from farm to cup?",unit:"litres",min:1,max:1000,log:true,ans:140,ansText:"About 140 litres",why:"Almost all of it is the rain and irrigation needed to grow the beans, not the water in your mug.",tip:"Brew only what you’ll drink. Pouring half a pot away wastes the farm’s water too.",src:"Water Footprint Network"},
 {who:"prosperity",q:"Moving one tonne of goods one kilometre: how many times more CO2 does a plane emit than a container ship?",unit:"times",min:1,max:500,log:true,ans:50,ansText:"Around 50 times",why:"Container ships are incredibly efficient per tonne. So how food travelled matters more than how far: bananas from Ecuador come by ship, while out-of-season berries or asparagus are often flown in.",tip:"Delicate fresh produce out of season is the most likely to have been flown.",src:"Our World in Data, freight emissions"}
];
const DAILY=[
 {who:"planet",t:"Bananas sail, berries fly",b:"Bananas are picked green and shipped across the ocean in cooled containers at about 13 °C, then ripened in special rooms near you. Ships are so efficient that a banana from Ecuador can have a smaller footprint than a vegetable flown in out of season.",tryThis:"When buying fresh produce out of season, think about how it travelled, not just how far.",src:"Our World in Data"},
 {who:"prosperity",t:"Slow ships save fuel",b:"A ship’s engine power rises roughly with the cube of its speed. Sailing about 10% slower cuts the fuel per journey by around a fifth, which is why many shipping lines now practise ‘slow steaming’.",tryThis:"Same idea on the road: 110 instead of 130 km/h on the motorway noticeably cuts your fuel use.",src:"Ship propulsion physics; ADEME"},
 {who:"people",t:"Who made my clothes?",b:"In 2013 the Rana Plaza garment factory in Bangladesh collapsed, killing 1,134 workers. It led to a binding safety agreement signed by around 200 brands, and to the global Fashion Revolution movement.",tryThis:"Next time you buy clothes, check whether the brand publishes its list of factories.",src:"ILO; Fashion Revolution"},
 {who:"planet",t:"Peat is a carbon vault",b:"Peatlands cover only about 3% of the world’s land, yet store roughly twice as much carbon as all the world’s forests. A lot of bagged garden compost is dug straight out of them.",tryThis:"Choose peat-free compost for your plants.",src:"UNEP, Global Peatlands Assessment"},
 {who:"prosperity",t:"Your phone’s footprint is already spent",b:"Around 80% of a smartphone’s lifetime footprint comes from making it, not charging it. So the greenest phone is usually the one in your pocket.",tryThis:"Fix a cracked screen or swap the battery before upgrading. In France the repair bonus can lower the bill.",src:"ADEME"},
 {who:"people",t:"The sparkle in your makeup",b:"Mica gives eyeshadow, toothpaste and car paint their shimmer. A big share comes from Jharkhand and Bihar in India, where investigations found tens of thousands of children working in informal mines.",tryThis:"Look for brands using synthetic mica or belonging to the Responsible Mica Initiative.",src:"Terre des Hommes (2018)"},
 {who:"planet",t:"Hot water is the real energy bill",b:"Around 90% of a washing machine’s energy goes into heating water, not spinning the drum. Modern detergents are designed to work well cold.",tryThis:"Try 30 °C for your next everyday load.",src:"Energy Saving Trust"},
 {who:"people",t:"Fix it with strangers",b:"The first Repair Café opened in Amsterdam in 2009. Today there are thousands worldwide, where volunteers help you fix toasters, lamps and jeans for free, over coffee.",tryThis:"Find a repair café near you, or volunteer there if you’re handy.",src:"Repair Café International"},
 {who:"prosperity",t:"Wonky fruit tastes the same",b:"Lots of perfectly good fruit and veg never reach the shelf because they’re the wrong shape or size, and bakeries throw out unsold bread every night. Anti-waste apps now sell that surplus cheaply.",tryThis:"Try an anti-waste app like Too Good To Go for a surprise bag this week.",src:"FAO; Too Good To Go"},
 {who:"people",t:"Where your T-shirt money goes",b:"In the price of a typical high-street T-shirt, the wages of the people who sewed it are often around 1% or less. The brand, the shop and transport take most of the rest.",tryThis:"A higher price doesn’t guarantee fair pay, but brands that publish wage data are a good sign.",src:"Clean Clothes Campaign"},
 {who:"planet",t:"If food waste were a country",b:"Food that is lost or wasted causes around 8 to 10% of global greenhouse gas emissions. As a country, it would rank third, after China and the US.",tryThis:"Plan one ‘clear the fridge’ meal this week.",src:"UNEP, Food Waste Index"},
 {who:"prosperity",t:"There’s treasure in your drawer",b:"Old phones and laptops hold gold, silver, copper and palladium. Yet only about 22% of the world’s e-waste was formally collected and recycled in 2022.",tryThis:"Drop old devices at a shop collection point instead of keeping them in a drawer.",src:"UN Global E-waste Monitor (2024)"}
];
function dailyCard(){
  const t=today(),d=DAILY[((dayDiff("2026-01-01",t))%DAILY.length+DAILY.length)%DAILY.length],c=CAST[d.who];
  const read=S.dailyRead===t;
  return `<div class="panel daily"><p class="small muted" style="margin:0 0 8px">Today ${c.name} wants to tell you</p>
    <div class="who">${c.svg()}<div><h3>${d.t}</h3><p>${d.b}</p></div></div>
    <div class="try-this"><b>Try this:</b> ${d.tryThis}</div><p class="src">Source: ${d.src}</p>
    <div class="actions">${read?`<span class="badge">Read today. Something new tomorrow!</span>`:`<button class="btn sm" id="daily-ok">Got it, +2 seeds</button>`}<a class="btn ghost sm" href="#facts">Play Did you know</a></div></div>`;
}

/* ---------- state ---------- */
const KEY="ripple-v1";
function defaults(){return{quizDone:false,browsing:false,stage:null,openness:1,already:[],tries:[],finished:0,logs:[],seeds:0,stageFinishedBase:0,inviteSnooze:"",factsDone:[],stars:0,dailyRead:""}}
let S=defaults();
try{const raw=localStorage.getItem(KEY);if(raw)S=Object.assign(defaults(),JSON.parse(raw))}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
const pad=n=>String(n).padStart(2,"0");
function today(){const d=new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
function dayDiff(a,b){return Math.round((new Date(b+"T12:00")-new Date(a+"T12:00"))/864e5)}
function addDays(a,n){const d=new Date(a+"T12:00");d.setDate(d.getDate()+n);return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
const stage=()=>S.stage==null?0:S.stage;

function fmtImpact(im){
  const out=[];
  if(im.co2) out.push(`≈${+im.co2.toFixed(1)} kg CO2`);
  if(im.plastic) out.push(im.plastic>=1000?`≈${(im.plastic/1000).toFixed(1)} kg plastic`:`≈${Math.round(im.plastic)} g plastic`);
  if(im.water) out.push(`≈${Math.round(im.water)} L water`);
  if(im.kwh) out.push(`≈${+im.kwh.toFixed(1)} kWh`);
  if(im.eur) out.push(`≈€${im.eur.toFixed(2)} saved`);
  return out;
}

/* ---------- celebration ---------- */
const CHEERS={
 planet:["The ocean says thank you!","That’s a happy-planet move.","Little ripple, big pond. Lovely.","The trees are doing a tiny dance."],
 people:["That’s kindness in action!","People notice moves like that.","You make the world a bit warmer.","High five from the whole community!"],
 prosperity:["Smart and kind. Love it.","Your wallet and the world both win.","That’s money well not-spent!","Buzzing about that one!"]
};
function celebrate(pillar,msg,seeds){
  const c=CAST[pillar]||CAST.planet;
  document.getElementById("cele-char").innerHTML=c.svg();
  const lines=CHEERS[pillar]||CHEERS.planet;
  document.getElementById("cele-msg").textContent=msg||lines[Math.floor(Math.random()*lines.length)];
  document.getElementById("cele-seeds").textContent=`+${seeds} seeds`;
  const conf=document.getElementById("confetti");conf.innerHTML="";
  const cols=["var(--teal)","var(--sun)","var(--coral)","var(--leaf2)"];
  for(let i=0;i<34;i++){const p=document.createElement("i");p.style.left=Math.random()*100+"vw";p.style.background=cols[i%4];p.style.animationDelay=(Math.random()*.5)+"s";p.style.transform=`rotate(${Math.random()*180}deg)`;conf.appendChild(p)}
  const el=document.getElementById("cele");el.classList.add("on");
  document.getElementById("cele-close").focus();
}
function closeCele(){document.getElementById("cele").classList.remove("on");render()}
document.getElementById("cele-close").onclick=closeCele;
document.getElementById("cele").addEventListener("click",e=>{if(e.target.id==="cele")closeCele()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.getElementById("cele").classList.contains("on"))closeCele()});

/* ---------- actions ---------- */
function logIt(id){
  const t=today();
  S.logs.push({id,d:t});S.seeds+=5;save();
  celebrate(SW[id].pillar,null,5);
}
function startTry(id,days){
  if(S.tries.some(t=>t.id===id))return;
  S.tries.push({id,days,start:today(),hits:[]});S.seeds+=2;save();
  celebrate(SW[id].pillar,`You’re trying “${SW[id].title.toLowerCase()}” for ${days} days. No pressure, just see how it feels.`,2);
}
function checkIn(id){
  const t=S.tries.find(x=>x.id===id);if(!t)return;
  const d=today();
  if(!t.hits.includes(d))t.hits.push(d);
  S.logs.push({id,d});S.seeds+=5;save();
  celebrate(SW[id].pillar,null,5);
}
function finishTry(id,keep){
  const t=S.tries.find(x=>x.id===id);if(!t)return;
  S.tries=S.tries.filter(x=>x.id!==id);
  if(keep&&!S.already.includes(id))S.already.push(id);
  S.finished+=1;S.seeds+=20;save();
  celebrate(SW[id].pillar,keep?"It’s part of your life now. That’s a real ripple.":"You gave it a go, and that counts. Something else might fit better, and that’s completely fine.",20);
}
function setStage(i){S.stage=i;S.stageFinishedBase=S.finished;save();render()}

/* ---------- views ---------- */
function vToday(){
  const el=document.getElementById("v-today");
  const L=treeLevel(S.seeds);
  if(!S.quizDone&&!S.browsing){
    el.innerHTML=`
      <div class="scene ripple-anim">${treeSVG(0)}</div>
      <h1>Hi, welcome to Ripple</h1>
      <p class="muted">Small choices ripple out to people, the planet and your pocket. No pressure, no guilt. Just ideas that fit your life, and a little cheering when you try one.</p>
      <div class="row" style="margin:18px 0 22px"><div class="cast">${moss()}${juno()}${penny()}</div></div>
      <p class="small muted">Moss looks after the planet, Juno looks after people, and Penny looks after your pocket.</p>
      <div style="display:grid;gap:10px;margin-top:16px">
        <a class="btn wide" href="#quiz" id="go-quiz">Find my starting point</a>
        <button class="btn ghost wide" id="go-browse">Just look around</button>
      </div>
      <p class="foot">Takes about a minute. Nothing leaves your device.</p>`;
    document.getElementById("go-browse").onclick=()=>{S.browsing=true;save();location.hash="switches"};
    return;
  }
  const t=today();
  let html=`
    <div class="scene ripple-anim">
      <div class="stat"><b>${S.logs.length}</b><div class="small muted">good choices so far</div></div>
      ${treeSVG(L)}
    </div>`;
  html+=dailyCard();

  // stage invite
  const st=stage();
  if(S.quizDone&&st<3&&S.finished-S.stageFinishedBase>=2&&(!S.inviteSnooze||dayDiff(S.inviteSnooze,t)>=7)){
    html+=`<div class="panel invite"><div class="row"><div style="width:60px;flex:none">${penny()}</div><div><h3>You’ve been doing great</h3><p class="small">You’ve finished a few tries. Want to see some bigger switches? Or stay a ${STAGES[st].name} as long as you like.</p></div></div>
      <div class="actions"><button class="btn sun sm" id="inv-yes">Show me bigger ones</button><button class="btn ghost sm" id="inv-no">I’m happy here</button></div></div>`;
  }

  // tries
  html+=`<div class="section-title"><h2>What you’re trying</h2></div>`;
  if(!S.tries.length){
    html+=`<div class="panel"><p>Nothing on the go right now, and that’s perfectly fine.</p><p class="small muted">Whenever you feel like it, pick a small switch to try for a week or two.</p><div class="actions"><a class="btn sm" href="#switches">Browse switches</a></div></div>`;
  }
  S.tries.forEach(tr=>{
    const s=SW[tr.id];const day=dayDiff(tr.start,t)+1;
    const done=day>tr.days;
    const cnt=d=>S.logs.filter(l=>l.id===tr.id&&l.d===d).length;
    const total=S.logs.filter(l=>l.id===tr.id&&dayDiff(tr.start,l.d)>=0).length;
    let dots="";for(let i=0;i<tr.days;i++){const d=addDays(tr.start,i),n=cnt(d);dots+=`<span class="dot${n?" hit":""}${d===t?" today":""}" title="Day ${i+1}: ${n} ${n===1?"time":"times"}">${n>1?n:""}</span>`}
    const doneToday=tr.hits.includes(t);
    html+=`<div class="panel try" style="border-left-color:${s.pillar==="people"?"var(--coral)":s.pillar==="prosperity"?"var(--sun)":"var(--teal)"}">
      <h3>${s.title}</h3>
      <p class="small muted">${done?`Your ${tr.days}-day try is complete`:`Day ${day} of ${tr.days}`} · ${total} ${total===1?"time":"times"} so far</p>
      <div class="dots" aria-label="${total} check-ins">${dots}</div><p class="small muted" style="margin-top:-6px">Each circle is one day. If you do it more than once, the number shows inside.</p>
      ${done?`<p>You did it ${total} ${total===1?"time":"times"}. How did it feel? Keep it, or let it go. Both are good choices.</p>
        <div class="actions"><button class="btn sm" data-keep="${tr.id}">Keep it as a habit</button><button class="btn ghost sm" data-let="${tr.id}">Let it go</button></div>`
      :`<div class="actions"><button class="btn sm" data-check="${tr.id}">${doneToday?"I did it again":"I did it today"}</button><button class="link small" data-let="${tr.id}">Stop this try</button></div>`}
    </div>`;
  });

  // weekly recap
  const week=S.logs.filter(l=>dayDiff(l.d,t)<7);
  const sum={co2:0,plastic:0,water:0,kwh:0,eur:0};
  week.forEach(l=>{const im=SW[l.id]?SW[l.id].impact:{};for(const k in sum)sum[k]+=im[k]||0});
  const tiles=[];
  if(sum.co2)tiles.push([`${+sum.co2.toFixed(1)} kg`,"CO2 avoided"]);
  if(sum.plastic)tiles.push([`${Math.round(sum.plastic)} g`,"plastic skipped"]);
  if(sum.water)tiles.push([`${Math.round(sum.water)} L`,"water saved"]);
  if(sum.kwh)tiles.push([`${+sum.kwh.toFixed(1)} kWh`,"energy saved"]);
  if(sum.eur)tiles.push([`€${sum.eur.toFixed(2)}`,"in your pocket"]);
  html+=`<div class="section-title"><h2>Your week</h2><span class="small muted">last 7 days</span></div><div class="panel">`;
  if(!week.length){html+=`<p>A fresh week. Anything you log will show up here.</p>`}
  else{
    const msg=week.length>=5?"Juno is so proud of you!":"Every one of these counts.";
    html+=`<div class="row"><div style="width:56px;flex:none">${juno()}</div><p><b>${week.length} good ${week.length===1?"choice":"choices"} this week.</b> ${msg}</p></div>`;
    if(tiles.length)html+=`<div class="recap">${tiles.map(x=>`<div><b>${x[0]}</b><span class="small muted">${x[1]}</span></div>`).join("")}</div>`;
    html+=`<p class="small muted" style="margin-top:10px">Rough estimates, so treat them as a friendly guide.</p>`;
  }
  html+=`</div>`;

  if(!S.quizDone)html+=`<div class="panel"><h3>Want suggestions that fit you?</h3><p class="small muted">A one-minute quiz helps us pick ideas that suit your life.</p><div class="actions"><a class="btn sm" href="#quiz">Take the quiz</a></div></div>`;
  html+=`<div class="panel"><h3>Meet the crew</h3>
    <div class="row" style="margin-top:8px"><div style="width:58px;flex:none">${moss()}</div><p class="small"><b>Moss</b> the turtle looks after the planet: carbon, water, plastic.</p></div>
    <div class="row"><div style="width:58px;flex:none">${juno()}</div><p class="small"><b>Juno</b> the otter looks after people: fair work, communities, kindness.</p></div>
    <div class="row"><div style="width:58px;flex:none">${penny()}</div><p class="small"><b>Penny</b> the bee looks after your pocket and local businesses.</p></div>
  </div>`;
  html+=`<p class="foot">Just browsing is great too. Knowing is the first step.</p>`;
  el.innerHTML=html;

  const dok=document.getElementById("daily-ok");if(dok)dok.onclick=()=>{S.dailyRead=today();S.seeds+=2;save();render()};
  el.querySelectorAll("[data-check]").forEach(b=>b.onclick=()=>checkIn(b.dataset.check));
  el.querySelectorAll("[data-keep]").forEach(b=>b.onclick=()=>finishTry(b.dataset.keep,true));
  el.querySelectorAll("[data-let]").forEach(b=>b.onclick=()=>{
    const tr=S.tries.find(x=>x.id===b.dataset.let);
    if(tr&&dayDiff(tr.start,t)+1>tr.days)finishTry(tr.id,false);
    else{S.tries=S.tries.filter(x=>x.id!==b.dataset.let);save();render()}
  });
  const y=document.getElementById("inv-yes"),n=document.getElementById("inv-no");
  if(y)y.onclick=()=>{setStage(Math.min(3,stage()+1));celebrate("prosperity",`Welcome to ${STAGES[stage()].name}! New switches are waiting for you.`,10);S.seeds+=10;save()};
  if(n)n.onclick=()=>{S.inviteSnooze=today();save();render()};
}

/* quiz */
let Q={i:0,ans:[]};
function vQuiz(){
  const el=document.getElementById("v-quiz");
  if(Q.i>=QUIZ.length){return vResult(el)}
  const q=QUIZ[Q.i];const c=CAST[q.who];
  el.innerHTML=`
    <div class="row" style="justify-content:space-between"><button class="link" id="q-back">${Q.i?"Back":"Close"}</button><span class="small muted">${Q.i+1} of ${QUIZ.length}</span></div>
    <div class="progress"><i style="width:${(Q.i/QUIZ.length)*100}%"></i></div>
    ${Q.i===0?`<p class="small muted" style="margin-top:-8px">No right or wrong answers. This just helps us suggest ideas that fit your life.</p>`:""}
    <div class="qhead">${c.svg()}<div class="speech"><h2 style="font-size:1.3rem">${q.q}</h2>${q.sub?`<p class="small muted">${q.sub}</p>`:""}</div></div>
    <div class="opts">${q.o.map((o,k)=>`<button class="opt" data-k="${k}">${o[0]}</button>`).join("")}</div>`;
  el.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{Q.ans[Q.i]=+b.dataset.k;Q.i++;render();window.scrollTo(0,0)});
  document.getElementById("q-back").onclick=()=>{if(Q.i===0){location.hash="today"}else{Q.i--;render()}};
}
function quizOutcome(){
  let score=0,already=new Set(),open=1;const P={planet:[0,0],people:[0,0],prosperity:[0,0]};
  QUIZ.forEach((q,i)=>{const o=q.o[Q.ans[i]];if(!o)return;score+=o[1];o[2].forEach(x=>already.add(x));if(o[3]!=null)open=o[3];if(q.p){P[q.p][0]+=o[1];P[q.p][1]+=3}});
  const st=score<=8?0:score<=14?1:score<=20?2:3;
  const pct={};for(const k in P)pct[k]=P[k][1]?P[k][0]/P[k][1]:0;
  const weak=Object.keys(pct).sort((a,b)=>pct[a]-pct[b])[0];
  return{st,already:[...already],open,pct,weak};
}
let RES=null;
function vResult(el){
  if(!RES){RES=quizOutcome();RES.pick=RES.st}
  const st=RES.pick;
  const sugg=suggestions(st,RES.already,RES.open===0?1:3,RES.weak);
  el.innerHTML=`
    <div class="scene ripple-anim">${treeSVG([0,1,2,5][st])}</div>
    <p class="muted" style="margin:0">Your starting point</p>
    <h1>You’re a ${STAGES[st].name}</h1>
    <p>${STAGES[st].line}</p>
    ${RES.already.length?`<div class="panel"><div class="row"><div style="width:56px;flex:none">${moss()}</div><p><b>You’re already doing ${RES.already.length} good ${RES.already.length===1?"thing":"things"}!</b></p></div><div class="already">${RES.already.map(id=>`<span class="pill ${SW[id].pillar}">${SW[id].title}</span>`).join("")}</div></div>`:""}
    ${RES.pct?`<div class="panel"><h3>Your ripples so far</h3><p class="small muted">Sustainability is about people and money too, not just the planet. Here’s where you’re already making a difference.</p>
      ${["planet","people","prosperity"].map(k=>`<div style="margin-top:12px"><div class="row" style="gap:10px"><span class="mini-char">${CAST[k].svg()}</span><span><b>${CAST[k].label}</b> <span class="small muted">with ${CAST[k].name}</span></span></div><div class="progress" style="margin:4px 0 0"><i style="width:${Math.max(6,Math.round(RES.pct[k]*100))}%;background:${k==="planet"?"var(--teal)":k==="people"?"var(--coral)":"var(--sun)"}"></i></div></div>`).join("")}
      <p class="small" style="margin-top:12px">${CAST[RES.weak].name} has an easy idea for you below.</p></div>`:""}
    <p class="small muted" style="margin-top:18px">Doesn’t feel right? Pick another. You can change it anytime.</p>
    <div class="stages">${STAGES.map((s,i)=>`<button class="stage${i===st?" on":""}" data-s="${i}" aria-pressed="${i===st}">${treeSVG([0,1,2,5][i],{mini:true})}${s.name}</button>`).join("")}</div>
    <div class="section-title"><h2>Fancy trying something?</h2></div>
    <p class="small muted">Only if you want to. Pick one for 7 or 14 days, and we’ll cheer every time you do it.</p>
    ${sugg.map(s=>swCard(s,{compact:true})).join("")}
    <button class="btn ghost wide" id="r-skip" style="margin-top:10px">Not right now</button>`;
  el.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>{RES.pick=+b.dataset.s;render()});
  const finish=()=>{
    if(!S.quizDone){S.seeds+=10+3*RES.already.length}
    S.quizDone=true;S.stage=RES.pick;S.stageFinishedBase=S.finished;S.openness=RES.open;
    RES.already.forEach(id=>{if(!S.already.includes(id))S.already.push(id)});
    save();
  };
  el.querySelectorAll("[data-try]").forEach(b=>b.onclick=()=>{finish();const [id,d]=b.dataset.try.split("|");Q={i:0,ans:[]};RES=null;location.hash="today";startTry(id,+d)});
  el.querySelectorAll("[data-log]").forEach(b=>b.remove());
  document.getElementById("r-skip").onclick=()=>{finish();Q={i:0,ans:[]};RES=null;location.hash="today"};
}
function suggestions(st,already,n,weak){
  const cap=[1,2,3,3][st];
  const pool=SWITCHES.filter(s=>s.stage<=st&&s.effort<=cap&&!already.includes(s.id)&&!S.tries.some(t=>t.id===s.id))
    .sort((a,b)=>((b.pillar===weak)-(a.pillar===weak))||(b.stage-a.stage)||(a.effort-b.effort));
  const out=[],seen=new Set();
  for(const s of pool){if(out.length>=n)break;if(!seen.has(s.pillar)||pool.length-out.length<=n-out.length){out.push(s);seen.add(s.pillar)}}
  for(const s of pool){if(out.length>=n)break;if(!out.includes(s))out.push(s)}
  return out;
}

/* switches */
let CAT="all";
function swCard(s,opt={}){
  const c=CAST[s.pillar];const imp=fmtImpact(s.impact);
  const trying=S.tries.some(t=>t.id===s.id);const doing=S.already.includes(s.id);
  return `<div class="panel sw">
    <div class="top">${c.svg()}<div><h3>${s.title}</h3><p class="small">${s.how}</p>
      ${doing?`<span class="badge">You already do this. Lovely!</span>`:""}${trying?`<span class="badge">You’re trying this now</span>`:""}</div></div>
    <div class="impact"><span class="pill ${s.pillar}">${c.label}</span>${imp.map(x=>`<span class="pill">${x} ${s.per}</span>`).join("")}<span class="effort" style="align-self:center">${EFFORT[s.effort]}</span></div>
    <details><summary>Where this comes from</summary><p>${s.note}</p></details>
    <div class="actions">
      ${trying?`<a class="btn sm" href="#today">See my try</a>`:doing?"":`<button class="btn sm" data-try="${s.id}|7">Try for 7 days</button><button class="btn ghost sm" data-try="${s.id}|14">14 days</button>`}
      ${opt.compact||trying?"":`<button class="btn ghost sm" data-log="${s.id}">I did this today</button>`}
    </div></div>`;
}
function vSwitches(){
  const cats=document.getElementById("cats");
  cats.innerHTML=Object.entries(CATS).map(([k,v])=>`<button class="chip${k===CAT?" on":""}" data-c="${k}" role="tab" aria-selected="${k===CAT}">${v}</button>`).join("");
  cats.querySelectorAll(".chip").forEach(b=>b.onclick=()=>{CAT=b.dataset.c;vSwitches()});
  const st=stage();
  const list=SWITCHES.filter(s=>CAT==="all"||s.cat===CAT);
  const fit=list.filter(s=>s.stage<=st),later=list.filter(s=>s.stage>st);
  let html="";
  if(fit.length)html+=(S.quizDone?`<p class="small muted">Picked for a ${STAGES[st].name}</p>`:"")+fit.map(s=>swCard(s)).join("");
  if(later.length)html+=`<div class="section-title"><h3>Bigger steps for later</h3></div><p class="small muted">Here whenever you’re curious. No rush.</p>`+later.map(s=>swCard(s)).join("");
  const box=document.getElementById("swlist");box.innerHTML=html;
  box.querySelectorAll("[data-try]").forEach(b=>b.onclick=()=>{const [id,d]=b.dataset.try.split("|");startTry(id,+d)});
  box.querySelectorAll("[data-log]").forEach(b=>b.onclick=()=>logIt(b.dataset.log));
}

/* did you know: topic tracks */
const MKT=[
 {q:"From 27 September 2026, what happens to a vague claim like ‘eco-friendly’ on products sold to EU consumers?",opts:["It’s banned unless the company can prove recognised excellent environmental performance","It’s fine as long as it’s in small print","It just needs a carbon offset certificate","Nothing, the rule was cancelled"],ans:0,why:"The EU’s Empowering Consumers for the Green Transition Directive now applies in all 27 member states. Generic words like ‘green’, ‘eco-friendly’ or ‘climate friendly’ need proof, and there was no transition period: products already on shelves had to comply too.",int:"Use it when asked how regulation is changing brand communication in Europe. Brands are moving from vague adjectives to specific, provable claims.",src:"Directive (EU) 2024/825; Latham & Watkins (Sept 2026)"},
 {q:"True or false: under the new EU rules, a brand can still call a product ‘climate neutral’ because it buys carbon offsets.",opts:["True","False"],ans:1,why:"Claims that a product has a neutral, reduced or positive climate impact based on offsetting are now banned for EU consumers. Companies can still talk about projects they fund, just not use them to call the product neutral.",int:"Shows you understand why companies are moving from ‘carbon neutral’ labels to reporting actual emission cuts.",src:"Directive (EU) 2024/825; TLT LLP"},
 {q:"True or false: a brand name like ‘EcoClean’ is exempt from the new EU green claims rules because it’s a registered trademark.",opts:["True","False"],ans:1,why:"The ban on unproven generic environmental claims also reaches existing brand and trademark names, despite intellectual property protection. Some brands have to rename products or prove the claim.",int:"A sharp detail for marketing interviews: compliance now reaches all the way into naming and brand architecture.",src:"Trellis (Sept 2026)"},
 {q:"In an EU-wide check of websites, what share of green claims did authorities think could be exaggerated, false or deceptive?",unit:"%",min:0,max:100,log:false,ans:42,ansText:"42%",why:"Authorities looked closely at 344 suspicious claims in fashion, cosmetics and household goods. In 37% of cases the claims used vague words like ‘conscious’ or ‘sustainable’, and in 59% the evidence wasn’t easy to find. This sweep fed directly into the new EU rules.",int:"A strong opening number for any answer on why claim substantiation matters.",src:"European Commission website sweep (Jan 2021)"},
 {q:"In March 2024, an Amsterdam court reviewed 19 environmental statements from KLM’s ‘Fly Responsibly’ ads. How many did it find misleading?",opts:["3","9","15","All 19"],ans:2,why:"The court said lines like creating ‘a more sustainable future’ painted an overly rosy picture and overstated what sustainable aviation fuel can do today. KLM wasn’t fined, but has to be ‘honest and concrete’ in future ads.",int:"Good proof that ‘ambition’ language can still be unlawful if it implies more than the company actually does.",src:"District Court of Amsterdam, 20 March 2024"},
 {q:"In October 2025, a Paris court ruled that TotalEnergies had misled consumers. Which claim was the problem?",opts:["Its ambition to reach carbon neutrality by 2050 while still growing fossil fuel production","Calling its petrol ‘premium’","Using green in its logo","Its loyalty card prices"],ans:0,why:"It was the first time a court found an oil major guilty of greenwashing its climate strategy. The company had to remove the messages and publish the ruling on its website. The court dismissed the NGOs’ other claims, about gas and biofuels.",int:"Shows that net-zero targets are now treated as marketing claims, which have to match the business model and capital spending.",src:"Paris Judicial Court, 23 Oct 2025; Columbia Sabin Center"},
 {q:"Under the new EU rules, fines for misleading green claims can reach up to what share of a company’s annual turnover?",opts:["0.5%","1%","4%","10%"],ans:2,why:"National consumer authorities and courts enforce the rules, and for serious breaches fines can reach up to 4% of annual turnover.",int:"Useful when explaining why green claims are now a legal and finance question, not only a creative one.",src:"Anthesis; EU Unfair Commercial Practices Directive"}
];
const SC=[
 {q:"On average, how many times larger are companies’ supply chain (Scope 3) emissions than the emissions from their own operations?",unit:"times",min:1,max:100,log:true,ans:26,ansText:"About 26 times",why:"That’s from data companies reported to CDP for 2023. Yet only 15% of those companies had set a target for their supply chain emissions.",int:"Explains why procurement teams are now central to climate strategy: most of the footprint sits with suppliers.",src:"CDP & BCG, Scope 3 Upstream (2024)"},
 {q:"Since 19 July 2026, what can large fashion and footwear companies no longer do in the EU?",opts:["Destroy unsold clothes and shoes","Sell polyester","Hold end-of-season sales","Import from outside the EU"],ans:0,why:"Before the ban, an estimated 4 to 9% of unsold textiles in Europe were destroyed before ever being worn. Large companies now have to resell, donate or reuse them, with a few strict exceptions. Medium-sized firms follow in 2030.",int:"Connects overproduction, inventory planning and brand protection. A great example for supply chain or merchandising roles.",src:"European Commission; ESPR Delegated Regulation (EU) 2026/296"},
 {q:"After being postponed twice, when does the EU Deforestation Regulation (EUDR) start applying to large companies?",opts:["30 December 2024","30 December 2025","30 December 2026","It was scrapped"],ans:2,why:"Companies selling cattle, cocoa, coffee, palm oil, rubber, soy or wood products in the EU must show they’re deforestation-free. Small and micro firms follow in June 2027. In May 2026 the Commission said its simplifications would cut compliance costs by about 75%.",int:"Good for any sourcing role: traceability down to the farm plot is becoming a condition for selling in Europe.",src:"Regulation (EU) 2025/2650; European Commission review (May 2026)"},
 {q:"After the Omnibus I changes, which companies are covered by the EU’s supply chain due diligence law (CSDDD)?",opts:["Over 250 employees","Over 1,000 employees and €450 million turnover","Over 5,000 employees and €1.5 billion turnover","Every company importing into the EU"],ans:2,why:"The scope was cut sharply and obligations now start in July 2029. Climate transition plans were dropped from the law, and maximum penalties went from 5% to 3% of turnover.",int:"Lets you discuss the EU’s ‘simplification’ shift with precise numbers, which interviewers notice.",src:"Omnibus I, Directive (EU) 2026/470"},
 {q:"In March 2021 the Ever Given blocked the Suez Canal for six days. Roughly how much trade was held up each day?",unit:"billion dollars",min:0.1,max:100,log:true,ans:9.6,ansText:"About $9.6 billion",why:"One ship stuck sideways froze a channel that carries a large share of world trade, and the knock-on delays rippled through ports for weeks.",int:"The go-to example of chokepoint risk, and why companies now map logistics routes, not just suppliers.",src:"Lloyd’s List estimate (2021)"},
 {q:"What share of world trade, by volume, travels by sea?",unit:"%",min:0,max:100,log:false,ans:80,ansText:"Over 80%",why:"Shipping is the backbone of global trade. That’s why trouble at sea hits supply chains so fast, and why cleaning up shipping fuel matters so much.",int:"A handy framing number for logistics, maritime or trade roles.",src:"UNCTAD, Review of Maritime Transport"}
];
const FIN=[
 {q:"Since May 2025, what must an EU fund show to keep words like ‘ESG’ or ‘sustainable’ in its name?",opts:["At least 80% of its investments meet its stated ESG characteristics","At least 20% green holdings","One certified green bond","An annual sustainability report"],ans:0,why:"ESMA’s fund-naming guidelines also require fossil fuel exclusions for many terms. Morningstar estimated that at least 1,450 funds changed their names between January 2024 and mid-2025, most by dropping ESG words.",int:"A precise example of regulators closing the gap between labels and portfolios.",src:"ESMA guidelines on fund names; Morningstar (2025)"},
 {q:"In 2023 the US SEC fined DWS, Deutsche Bank’s asset manager, for overstating its ESG credentials. How much?",unit:"million dollars",min:1,max:100,log:true,ans:19,ansText:"$19 million",why:"It was the largest greenwashing penalty the SEC had imposed on an asset manager. It began when the firm’s former sustainability chief blew the whistle in 2021; police later raided its offices and the CEO resigned. German prosecutors added a €25 million fine in 2025.",int:"The classic ‘say-do gap’ case: claiming ESG is ‘in our DNA’ without the processes to back it up.",src:"US SEC (Sept 2023); Frankfurt Public Prosecutor (April 2025)"},
 {q:"What happened to the UN-backed Net-Zero Banking Alliance in October 2025?",opts:["Its members voted to shut it down","It doubled in size","Its targets became legally binding","It merged with the ISSB"],ans:0,why:"Launched in 2021, it once counted around 140 banks. Major US banks left in early 2025 amid political pressure, others followed, and the remaining members voted to end it while keeping its guidance as a reference.",int:"Useful context on the limits of voluntary alliances compared with regulation.",src:"Reuters; The Canadian Press (Oct 2025)"},
 {q:"After Omnibus I, which EU companies must publish sustainability reports under the CSRD?",opts:["Over 250 employees or €50 million turnover","Over 1,000 employees and over €450 million turnover","Only listed companies","Over 5,000 employees"],ans:1,why:"A company has to cross both thresholds. The original rules used far lower ones, so the number of companies in scope fell dramatically.",int:"Knowing the exact thresholds shows you follow the regulation closely, not just the headlines.",src:"Directive (EU) 2026/470 (Omnibus I)"},
 {q:"Around 50,000 companies were expected to report under the original CSRD. After Omnibus I, roughly how many?",unit:"companies",min:100,max:50000,log:true,ans:5000,ansText:"About 5,000",why:"That’s roughly a 90% cut in scope. Supporters call it cutting red tape; critics say investors lose a lot of data.",int:"Good for discussing the trade-off between regulatory burden and transparency.",src:"Dcycle analysis of Omnibus I (2026)"},
 {q:"Between 2024 and 2025, holdings of TotalEnergies across EU ESG funds fell by about a quarter. What mainly drove it?",opts:["Fund-naming rules that require fossil fuel exclusions","A ban on French shares","TotalEnergies leaving the stock market","Lower oil prices"],ans:0,why:"To keep ESG-related names, many funds had to exclude companies earning significant revenue from fossil fuels, so they sold shares like TotalEnergies.",int:"Shows how a naming rule moved real money.",src:"Morningstar (2025)"}
];
const BASICS=[
 {who:"planet",q:"How many litres of water go into making one pair of jeans?",unit:"litres",min:100,max:20000,log:true,ans:7500,ansText:"About 7,500 litres",why:"That’s roughly what one person drinks in seven years. Most of it goes into growing the cotton, the rest into dyeing and finishing.",tip:"Buying your next pair secondhand skips almost all of that.",src:"UN Environment Programme"},
 {who:"prosperity",q:"How much water does one flush of an older single-flush toilet use?",unit:"litres",min:0,max:20,log:false,ans:10,ansText:"Around 9 to 12 litres",why:"A modern dual-flush toilet uses about 3 litres for the small button and 6 for the big one. Older cisterns can use up to 13 litres, every single time.",tip:"Use the small button whenever you can. With an old toilet, a full water bottle placed in the cistern trims every flush.",src:"NI Water; Consumer NZ"},
 {who:"planet",q:"Swap one beef meal for a vegetarian one. How much CO2 does that save?",unit:"kg CO2",min:0.1,max:20,log:true,ans:6.75,ansText:"About 6.75 kg CO2e",why:"A typical meal with beef emits about 7.26 kg CO2e, a vegetarian meal about 0.51 kg. Even swapping a chicken meal (about 1.58 kg) saves around 1 kg.",tip:"Two vegetarian meals a week instead of beef adds up to roughly 700 kg CO2e a year.",src:"ADEME, Impact CO2"},
 {who:"planet",q:"How much water goes into producing 1 kg of beef?",unit:"litres",min:100,max:50000,log:true,ans:15400,ansText:"About 15,000 litres",why:"Most of it is the water needed to grow the animals’ feed over their lifetime. Most vegetables need a few hundred litres per kilo.",tip:"Swapping half the beef in a chilli or bolognese for lentils keeps the taste and cuts the footprint.",src:"Water Footprint Network"},
 {who:"prosperity",q:"How much water runs down the drain each minute if you leave the tap on while brushing your teeth?",unit:"litres",min:0,max:20,log:false,ans:6,ansText:"About 6 litres",why:"Two minutes, twice a day, is around 24 litres a day, nearly 9,000 litres a year, just to rinse a toothbrush.",tip:"Turn the tap off while you brush. That’s it.",src:"UK water industry figures"},
 {who:"people",q:"How many litres of water go into one cotton T-shirt?",unit:"litres",min:100,max:10000,log:true,ans:2700,ansText:"About 2,700 litres",why:"That’s about what one person drinks in two and a half years. Cotton is often grown in dry regions where farming communities compete for the same water.",tip:"Wear it longer, wash it cooler, and pass it on when you’re done.",src:"WWF"}
];
const TRACKS={
 mix:{name:"Everyday life",who:"planet",facts:(()=>{const b=[2,0,1,5,4,3].map(i=>BASICS[i]),f=[2,4,0,7,11,9,5,6,3,8,10,1].map(i=>FACTS[i]),o=[];for(let i=0;i<Math.max(b.length,f.length);i++){if(b[i])o.push(b[i]);if(f[i])o.push(f[i])}return o})()},
 mkt:{name:"Marketing & greenwashing",who:"people",facts:MKT},
 sc:{name:"Supply chain & procurement",who:"prosperity",facts:SC},
 fin:{name:"ESG & finance",who:"prosperity",facts:FIN}
};
const CHECKED="November 2026";
function TS(k){S.tr=S.tr||{};if(!S.tr[k]){S.tr[k]={done:[],stars:0,n:5,last:""};if(k==="life"&&S.factsDone&&S.factsDone.length){S.tr[k].done=S.factsDone.slice();S.tr[k].stars=S.stars||0;S.tr[k].n=Math.max(5,S.factsDone.length)}}return S.tr[k]}
function unlocked(k){const st=TS(k),pool=TRACKS[k].facts.length;if(st.done.length>=st.n&&st.n<pool&&st.last&&st.last<today()){st.n=Math.min(pool,st.n+5);save()}return Math.min(st.n,pool)}
let F={i:null};
function fVal(f,pos){return f.log?f.min*Math.pow(f.max/f.min,pos/1000):f.min+(f.max-f.min)*pos/1000}
function nice(v){if(v<10)return Math.round(v*10)/10;const p=Math.pow(10,Math.floor(Math.log10(v))-1);return Math.round(v/p)*p}
function fmtN(v,f){return new Intl.NumberFormat("en").format(nice(v))+(f.unit==="%"?"%":" "+f.unit)}
function vFacts(){
  const el=document.getElementById("v-facts");
  let CUR=S.curTrack&&TRACKS[S.curTrack]?S.curTrack:"mix";
  const T=TRACKS[CUR],st=TS(CUR),n=unlocked(CUR),pool=T.facts.length;
  const chips=Object.entries(TRACKS).map(([k,t])=>`<button class="chip${k===CUR?" on":""}" data-t="${k}">${t.name}</button>`).join("");
  const head=`<h1>Did you know?</h1><p class="muted">Pick a topic, guess first, then see the real answer.</p><div class="chips">${chips}</div>
    <div class="progress" style="margin-bottom:6px"><i style="width:${st.done.length/pool*100}%"></i></div><p class="small muted" style="margin:0 0 14px">${st.done.length} of ${pool} played in this topic, ${st.stars} ★ earned</p>`;
  const bindChips=()=>el.querySelectorAll("[data-t]").forEach(b=>b.onclick=()=>{S.curTrack=b.dataset.t;save();F={i:null};render()});
  if(F.i==null||F.t!==CUR){const left=[...Array(n).keys()].filter(k=>!st.done.includes(k));F={t:CUR,i:left.length?left[Math.floor(Math.random()*left.length)]:-1,pos:500,rev:false}}
  if(F.i===-1){
    const more=n<pool;
    el.innerHTML=head+`<div class="qhead">${penny()}<div class="speech"><h2 style="font-size:1.25rem">${more?"That’s everything for today in this topic!":"You’ve played every fact in this topic!"}</h2><p class="small muted">${more?`${Math.min(5,pool-n)} new ones unlock tomorrow. Try another topic in the meantime.`:"New facts get added regularly. Try another topic in the meantime."}</p></div></div>`;
    bindChips();return;
  }
  const f=T.facts[F.i],c=CAST[f.who||T.who];
  const record=()=>{if(!st.done.includes(F.i))st.done.push(F.i);st.stars+=F.stars;S.seeds+=F.stars;if(st.done.length>=unlocked(CUR))st.last=today();save();render();window.scrollTo(0,0)};
  if(!F.rev){
    if(f.opts){
      el.innerHTML=head+`<div class="qhead">${c.svg()}<div class="speech"><h2 style="font-size:1.18rem">${f.q}</h2></div></div>
        <div class="opts">${f.opts.map((o,k)=>`<button class="opt" data-k="${k}">${o}</button>`).join("")}</div>`;
      el.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{F.pick=+b.dataset.k;F.stars=F.pick===f.ans?3:1;F.rev=true;record()});
    }else{
      el.innerHTML=head+`<div class="qhead">${c.svg()}<div class="speech"><h2 style="font-size:1.18rem">${f.q}</h2></div></div>
        <div class="panel"><p class="small muted" style="text-align:center;margin:0">Your guess</p><div class="guess-val" id="gv">${fmtN(fVal(f,F.pos),f)}</div>
        <input type="range" min="0" max="1000" value="${F.pos}" id="gs" aria-label="Your guess">
        <div class="scale"><span>${fmtN(f.min,f)}</span><span>${fmtN(f.max,f)}</span></div>
        <button class="btn wide" id="lock" style="margin-top:16px">Lock in my guess</button></div>`;
      const gs=document.getElementById("gs"),gv=document.getElementById("gv");
      gs.oninput=()=>{F.pos=+gs.value;gv.textContent=fmtN(fVal(f,F.pos),f)};
      document.getElementById("lock").onclick=()=>{
        const g=nice(Math.max(fVal(f,F.pos),f.log?f.min:0));let s;
        if(f.log){const e=Math.abs(Math.log(Math.max(g,1e-9)/f.ans));s=e<Math.log(1.3)?3:e<Math.log(2.5)?2:1}
        else{const d=Math.abs(g-f.ans);s=d<=4?3:d<=12?2:1}
        F.stars=s;F.guess=g;F.rev=true;record();
      };
    }
    bindChips();return;
  }
  let msg,ansText,yours;
  if(f.opts){const ok=F.pick===f.ans;msg=ok?"Yes! Spot on.":"Not quite, but now you know!";ansText=f.opts[f.ans];yours=ok?`+3 seeds`:`You picked: ${f.opts[F.pick]}. +1 seed for playing`}
  else{msg=F.stars===3?"Spot on! You really know your stuff.":F.stars===2?"Ooh, so close!":F.guess<f.ans?"Bigger than you thought, right?":"Smaller than you expected!";ansText=f.ansText;yours=`You guessed ${fmtN(F.guess,f)}, +${F.stars} seeds`}
  const more=[...Array(unlocked(CUR)).keys()].some(k=>!st.done.includes(k));
  el.innerHTML=head+`<div class="qhead">${c.svg()}<div class="speech"><h2 style="font-size:1.25rem">${msg}</h2></div></div>
    <div class="panel reveal"><p class="small muted" style="margin:0">${f.q}</p><div class="ans" style="margin-top:10px;${f.opts?"font-size:1.5rem":""}">${ansText}</div>
    <div class="stars" aria-label="${F.stars} of 3 stars">${"★".repeat(F.stars)}${"☆".repeat(3-F.stars)}</div>
    <p class="small muted">${yours}</p></div>
    <div class="panel"><p>${f.why}</p>
      ${f.tip?`<div class="try-this"><b>What you can do:</b> ${f.tip}</div>`:""}
      ${f.int?`<div class="try-this"><b>Interview angle:</b> ${f.int}</div>`:""}
      <p class="src">Source: ${f.src}${f.int?`. Last checked ${CHECKED}.`:""}</p></div>
    <button class="btn wide" id="nextf">${more?"Next fact":"Done for now"}</button>`;
  document.getElementById("nextf").onclick=()=>{F={i:null};render();window.scrollTo(0,0)};
  bindChips();
}

/* ask the crew */
const SUGGEST_URL=""; // paste your free Tally or Google Form link here to collect unanswered questions
const ASK=[
 {cat:"buy",q:"Should I buy a new phone or a refurbished one?",kw:["phone","smartphone","iphone","samsung","refurbished","upgrade","mobile","new phone"],
  chat:[["planet","Most of a phone’s lifetime footprint comes from making it, not charging it. A refurbished phone skips almost all of that."],["people","New phones need mined metals like cobalt, and some of it comes from mines with child labour. Every phone kept in use means a little less digging."],["prosperity","Refurbished phones often cost far less and usually come with a warranty. And if yours just needs a new battery or screen, repairing is cheaper still."]],
  take:"Keep the one you have as long as it works for you. When it’s time to change, go refurbished.",src:"ADEME; Amnesty International (2016)"},
 {cat:"buy",q:"Is an electric car really better than a petrol one?",kw:["electric car","ev","evs","tesla","petrol","diesel","hybrid","car","cars","electric vehicle"],
  chat:[["planet","Building the battery adds emissions at the start, but over its whole life an electric car in Europe usually ends up well ahead of a petrol one. In France, with its low-carbon electricity, the gap is even bigger."],["people","Battery metals raise real mining questions. On the other hand, no exhaust means cleaner air on busy streets, which matters a lot for people living next to them."],["prosperity","It usually costs more to buy and less to run. Support schemes change often, so check what’s available before deciding."]],
  take:"If you need a car, electric is usually the better choice. Even better is needing the car less, and choosing a smaller one.",src:"ICCT life-cycle studies; ADEME"},
 {cat:"buy",q:"Bottled water or tap water?",kw:["bottled water","bottle","bottles","tap water","water","evian","mineral water","filter"],
  chat:[["planet","Around a million plastic drinks bottles are bought every minute worldwide. Tap water skips the plastic and the trucks."],["people","Tap water in France is safe and closely monitored. If you don’t like the taste, a jug filter or letting it rest in the fridge helps."],["prosperity","Tap water costs a tiny fraction of bottled, often well over a hundred times less. Over a year that adds up."]],
  take:"Tap water in a bottle you like. It’s one of the easiest wins there is.",src:"UNEP; French water quality monitoring"},
 {cat:"buy",q:"Is organic food worth it?",kw:["organic","bio","pesticide","pesticides","organic food"],
  chat:[["planet","Organic farming uses far fewer synthetic pesticides, which is good for soil, insects and water. Per kilo it isn’t always lower carbon, because yields can be lower."],["people","Fewer pesticides means less exposure for the farmers and workers who handle them every day."],["prosperity","It usually costs more. If budget is tight, focus on what you eat most, and waste less, which saves money for the rest."]],
  take:"Organic helps nature, but eating more plants, buying in season and wasting less often matter even more.",src:"FAO; Our World in Data"},

 {cat:"big",q:"What is ESG, simply?",kw:["esg","environmental social governance","what is esg","esg meaning"],
  chat:[["planet","E is for environment: emissions, water, waste, nature. How a company affects the planet."],["people","S is for social: how it treats workers, suppliers, customers and communities."],["prosperity","G is for governance: how the company is run. Honest reporting, fair pay at the top, no bribery, and a board that actually checks the risks."]],
  take:"ESG is a way to judge whether a company is managing its impact and risks well, not just its profits. Regulators now check that ESG labels are backed by real numbers.",src:"ESMA; general ESG frameworks"},
 {cat:"big",q:"What is greenwashing?",kw:["greenwashing","greenwash","green claims","green claim","misleading","eco friendly","eco-friendly"],
  chat:[["planet","It’s when a company makes its environmental impact sound better than it is, with vague words, cherry-picked facts or pretty leaves on the packaging."],["people","It misleads people who are genuinely trying to make better choices, and makes it harder for honest brands to stand out."],["prosperity","It’s now a legal risk. EU rules since September 2026 ban unproven generic claims, and courts have ruled against KLM and TotalEnergies."]],
  take:"Look for specific, provable claims, like ‘50% recycled polyester’, rather than words like ‘green’ or ‘conscious’.",src:"Directive (EU) 2024/825; Amsterdam District Court (2024); Paris Judicial Court (2025)"}
];
function norm(t){return (t||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[’']/g,"").replace(/[^a-z0-9& -]/g," ").replace(/\s+/g," ").trim()}
function matchAsk(text){
  const base=norm(text),n=" "+base+" ",n2=" "+base.split(" ").map(w=>w.length>3?w.replace(/s$/,""):w).join(" ")+" ";
  return ASK.map((a,i)=>{let s=0;a.kw.forEach(k=>{const kk=norm(k);if(n.includes(" "+kk+" ")||n2.includes(" "+kk+" ")||(kk.length>5&&n.includes(kk)))s+=kk.includes(" ")?3:2});return{i,s}}).filter(x=>x.s>0).sort((x,y)=>y.s-x.s);
}
const esc=t=>(t||"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let ASKQ={text:"",i:null,miss:false,rel:[],loading:false,live:null};
async function askLive(question){
  try{
    const r=await fetch("/api/ask",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question})});
    const data=await r.json().catch(()=>null);
    if(!r.ok||!data||data.error||!data.synthesis)throw new Error("live ask failed");
    ASKQ.loading=false;ASKQ.live=data;vAsk();
  }catch(e){
    ASKQ.loading=false;ASKQ.miss=true;ASKQ.live=null;vAsk();
  }
}
function vAsk(){
  const el=document.getElementById("v-ask");
  let body="";
  if(ASKQ.i!=null){
    const a=ASK[ASKQ.i];
    body=`<div class="panel convo">${ASKQ.text&&norm(ASKQ.text)!==norm(a.q)?`<p class="small muted" style="margin:0">You asked: “${esc(ASKQ.text)}”. Here’s the closest one we’ve answered:</p>`:""}
      <h3 style="margin-top:6px">${a.q}</h3>
      ${a.chat.map(([w,t])=>`<div class="bubble-row"><span class="mini-char">${CAST[w].svg()}</span><div class="bubble ${w}"><b>${CAST[w].name}</b> <span class="small muted">on ${CAST[w].label.toLowerCase()}</span><p>${t}</p></div></div>`).join("")}
      <div class="try-this"><b>The crew’s take:</b> ${a.take}</div><p class="src">Sources: ${a.src}</p></div>
      ${ASKQ.rel.length?`<p class="small muted">Related questions</p><div class="qchips">${ASKQ.rel.map(i=>`<button class="chip" data-q="${i}">${ASK[i].q}</button>`).join("")}</div>`:""}`;
  }else if(ASKQ.loading){
    body=`<div class="panel convo"><p class="small muted" style="margin:0">You asked: “${esc(ASKQ.text)}”</p>
      <div class="bubble-row"><span class="mini-char">${moss()}</span><div class="bubble planet"><p>The crew is thinking this one through…</p></div></div></div>`;
  }else if(ASKQ.live){
    const L=ASKQ.live;
    body=`<div class="panel convo"><p class="small muted" style="margin:0">You asked: “${esc(ASKQ.text)}”</p>
      <div class="bubble-row"><span class="mini-char">${moss()}</span><div class="bubble planet"><b>Moss</b> <span class="small muted">on planet</span><p>${esc(L.planet_answer)}</p></div></div>
      <div class="bubble-row"><span class="mini-char">${juno()}</span><div class="bubble people"><b>Juno</b> <span class="small muted">on people</span><p>${esc(L.people_answer)}</p></div></div>
      <div class="bubble-row"><span class="mini-char">${penny()}</span><div class="bubble prosperity"><b>Penny</b> <span class="small muted">on prosperity</span><p>${esc(L.economy_answer)}</p></div></div>
      <div class="try-this"><b>The crew’s take:</b> ${esc(L.synthesis)}</div><p class="src">Thought through live just now, so do double-check anything important.</p></div>`;
  }else if(ASKQ.miss){
    body=`<div class="panel convo"><p class="small muted" style="margin:0">You asked: “${esc(ASKQ.text)}”</p>
      <div class="bubble-row"><span class="mini-char">${moss()}</span><div class="bubble planet"><b>Moss</b><p>Hmm, we had trouble thinking that one through just now.</p></div></div>
      <div class="bubble-row"><span class="mini-char">${juno()}</span><div class="bubble people"><b>Juno</b><p>Could be a slow connection, or we’re just stretched thin right now.</p></div></div>
      <div class="bubble-row"><span class="mini-char">${penny()}</span><div class="bubble prosperity"><b>Penny</b><p>${SUGGEST_URL?"Send it our way and we’ll have a proper look.":"Mind trying again in a moment, or picking one of the questions below?"}</p></div></div>
      ${SUGGEST_URL?`<div class="actions"><a class="btn sm" href="${SUGGEST_URL}" target="_blank" rel="noopener">Send us this question</a></div>`:""}</div>`;
  }
  const chipsFor=c=>ASK.map((a,i)=>a.cat===c?`<button class="chip" data-q="${i}">${a.q}</button>`:"").join("");
  el.innerHTML=`<h1>Ask the crew</h1>
    <p class="muted">Wondering if something’s a good choice? Moss, Juno and Penny each look at it from their side: planet, people and prosperity.</p>
    <div class="cast" style="margin:6px 0 4px">${moss()}${juno()}${penny()}</div>
    <form class="ask-box" id="ask-form"><input id="ask-in" type="text" placeholder="e.g. Should I buy a refurbished phone?" aria-label="Your question" value="${esc(ASKQ.text)}" autocomplete="off"><button class="btn" type="submit">Ask</button></form>
    ${body}
    <div class="section-title"><h3>Thinking of buying…</h3></div><div class="qchips">${chipsFor("buy")}</div>
    <div class="section-title"><h3>Bigger topics</h3></div><div class="qchips">${chipsFor("big")}</div>
    <p class="foot">The questions below are written by the Ripple team from public sources. Ask anything else and the crew will think it through live.</p>`;
  const show=i=>{ASKQ.i=i;ASKQ.miss=false;ASKQ.live=null;ASKQ.loading=false;S.asked=S.asked||[];if(!S.asked.includes(i)){S.asked.push(i);S.seeds+=1;save()}vAsk();el.querySelector(".convo")?.scrollIntoView({behavior:"smooth",block:"start"})};
  document.getElementById("ask-form").onsubmit=e=>{e.preventDefault();const t=document.getElementById("ask-in").value.trim();if(!t)return;ASKQ.text=t;const m=matchAsk(t);if(m.length){ASKQ.rel=m.slice(1,3).map(x=>x.i);show(m[0].i)}else{ASKQ.i=null;ASKQ.rel=[];ASKQ.live=null;ASKQ.miss=false;ASKQ.loading=true;vAsk();askLive(t)}};
  el.querySelectorAll("[data-q]").forEach(b=>b.onclick=()=>{ASKQ.text="";ASKQ.rel=[];show(+b.dataset.q)});
}

/* garden */
function vGarden(){
  const el=document.getElementById("v-garden");
  const L=treeLevel(S.seeds);const next=LEVELS[L+1];
  el.innerHTML=`
    <h1>My garden</h1>
    <div class="scene ripple-anim">${treeSVG(L)}</div>
    <h2>${LEVEL_NAMES[L]}</h2>
    <p class="muted">${S.seeds} seeds${next?`. ${next-S.seeds} more and it grows again.`:". Your grove is in full bloom!"}</p>
    <div class="recap" style="margin:14px 0">
      <div><b>${S.logs.length}</b><span class="small muted">good choices</span></div>
      <div><b>${S.finished}</b><span class="small muted">tries finished</span></div>
      <div><b>${S.already.length}</b><span class="small muted">habits you keep</span></div>
    </div>
    ${S.already.length?`<div class="panel"><h3>Habits you keep</h3><div class="already">${S.already.map(id=>`<span class="pill ${SW[id].pillar}">${SW[id].title}</span>`).join("")}</div></div>`:""}
    <div class="panel"><h3>Your stage</h3><p class="small muted">This only changes which ideas we show first. Change it whenever you like.</p>
      <div class="stages">${STAGES.map((s,i)=>`<button class="stage${S.stage===i?" on":""}" data-s="${i}" aria-pressed="${S.stage===i}">${treeSVG([0,1,2,5][i],{mini:true})}${s.name}</button>`).join("")}</div>
      ${S.stage!=null?`<p class="small">${STAGES[stage()].line}</p>`:""}
      <div class="actions"><a class="btn ghost sm" href="#quiz" id="redo">${S.quizDone?"Retake the quiz":"Take the quiz"}</a></div>
    </div>
    <div class="panel">${isSignedIn()?`<h3>Account</h3><p class="small">Saved to <b>${esc(AUTH.user.email)}</b>. It’ll follow you to any device you sign into.</p><div class="actions"><button class="btn ghost sm" id="acct-signout">Sign out</button><button class="link small" id="acct-delete">Delete my account</button></div>`:`<h3>Keep this safe</h3><p class="small muted">Sign in and your garden follows you to any device. Totally optional, nothing changes if you skip it.</p><button class="btn sm" id="acct-signin">Sign in</button>`}</div>
    <p class="foot"><button class="link" id="reset">Start over</button><br>${isSignedIn()?"Saved to your account, and on this device.":"Everything is saved on this device only."}</p>`;
  el.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>setStage(+b.dataset.s));
  document.getElementById("redo").onclick=()=>{Q={i:0,ans:[]};RES=null};
  document.getElementById("reset").onclick=()=>{if(confirm("Start over? This clears your garden, tries and choices on this device.")){S=defaults();save();location.hash="today";render()}};
  const asi=document.getElementById("acct-signin");if(asi)asi.onclick=openSignIn;
  const aso=document.getElementById("acct-signout");if(aso)aso.onclick=signOut;
  const adl=document.getElementById("acct-delete");if(adl)adl.onclick=deleteAccount;
}

/* ---------- router ---------- */
const ROUTES=["today","quiz","switches","facts","ask","garden"];
function render(){
  let r=location.hash.slice(1);if(!ROUTES.includes(r))r="today";
  ROUTES.forEach(x=>document.getElementById("v-"+x).classList.toggle("on",x===r));
  document.querySelectorAll("nav.tabs a").forEach(a=>a.classList.toggle("on",a.dataset.r===r));
  document.querySelector("nav.tabs").style.display=r==="quiz"?"none":"";
  document.querySelector(".topbar").style.display=r==="quiz"?"none":"";
  document.getElementById("back").style.visibility=r==="today"?"hidden":"visible";
  if(r==="today")vToday();if(r==="quiz")vQuiz();if(r==="switches")vSwitches();if(r==="garden")vGarden();if(r==="facts")vFacts();if(r==="ask")vAsk();
}
document.getElementById("back").onclick=()=>{location.hash="today"};
window.addEventListener("hashchange",()=>{if(location.hash==="#quiz"&&Q.i>=QUIZ.length&&!RES){Q={i:0,ans:[]}}render();window.scrollTo(0,0)});

/* ---------- optional sign-in ---------- */
let AUTH={user:null};
function isSignedIn(){return !!AUTH.user}
function redirectTarget(){return location.origin+location.pathname+"#garden"}
function renderSignInBody(sentTo){
  const el=document.getElementById("signin-body");
  if(sentTo){
    el.innerHTML=`<div style="width:70px;margin:0 auto 10px">${penny()}</div>
      <h2 id="signin-h" style="text-align:center">Check your inbox</h2>
      <p class="small muted" style="text-align:center">We sent a link to <b>${esc(sentTo)}</b>. Click it and you’re in, no password needed.</p>`;
    return;
  }
  el.innerHTML=`<div style="width:70px;margin:0 auto 10px">${penny()}</div>
    <h2 id="signin-h" style="text-align:center">Sign in</h2>
    <p class="small muted" style="text-align:center">Save your garden so it follows you to any device. Completely optional, nothing changes if you skip it.</p>
    <button class="btn wide" id="signin-google">Continue with Google</button>
    <p class="small muted" style="text-align:center;margin:14px 0">or</p>
    <input type="email" id="signin-email" class="field" placeholder="you@example.com" autocomplete="email">
    <button class="btn ghost wide" id="signin-send">Send me a link</button>
    <p class="small muted" style="text-align:center;margin-top:14px">By signing in you agree to our <a href="privacy.html">privacy page</a>.</p>`;
  document.getElementById("signin-google").onclick=()=>{
    if(!sb){alert("Sign-in isn’t available right now. Please try again later.");return}
    sb.auth.signInWithOAuth({provider:"google",options:{redirectTo:redirectTarget()}});
  };
  document.getElementById("signin-send").onclick=async()=>{
    const email=document.getElementById("signin-email").value.trim();
    if(!email)return;
    if(!sb){alert("Sign-in isn’t available right now. Please try again later.");return}
    const btn=document.getElementById("signin-send");btn.disabled=true;btn.textContent="Sending…";
    const {error}=await sb.auth.signInWithOtp({email,options:{emailRedirectTo:redirectTarget()}});
    if(error){btn.disabled=false;btn.textContent="Send me a link";alert("Something went wrong sending the link. Mind trying again?")}
    else renderSignInBody(email);
  };
}
function openSignIn(){renderSignInBody();document.getElementById("signin").classList.add("on")}
function closeSignIn(){document.getElementById("signin").classList.remove("on")}
document.getElementById("signin-close").onclick=closeSignIn;
document.getElementById("signin").addEventListener("click",e=>{if(e.target.id==="signin")closeSignIn()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&document.getElementById("signin").classList.contains("on"))closeSignIn()});

function signOut(){
  const removeLocal=confirm("Remove this garden from this device too? Choose Cancel to keep it here as a guest garden.");
  AUTH.user=null;
  if(sb)sb.auth.signOut();
  if(removeLocal){S=defaults();save()}
  render();
}
async function deleteAccount(){
  if(!confirm("Delete your account? This permanently removes your saved garden from our servers, and it can’t be undone."))return;
  if(sb){await sb.rpc("delete_my_account");await sb.auth.signOut()}
  AUTH.user=null;S=defaults();save();
  location.hash="today";render();
  alert("Your account and its data are gone. Thanks for growing a garden with us, even for a while. Take care!");
}
if(sb){
  sb.auth.getSession().then(({data})=>{AUTH.user=data.session?data.session.user:null;render()});
  sb.auth.onAuthStateChange((event,session)=>{AUTH.user=session?session.user:null;if(event==="SIGNED_IN")closeSignIn();render()});
}

render();
