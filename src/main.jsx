import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Stars } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import "./styles.css";

const projects = [
  ["PhishGuard AI","Security-focused URL analysis platform combining machine-learning features with DNS, SSL, WHOIS and other security indicators.","security ai",["Python","Flask","ML","Security"],"project-phishguard-ai.jpeg","https://phishguard-ai-4cxd.onrender.com/"],
  ["PortForge","Portfolio-building web application created to turn structured information into a polished developer portfolio experience.","web",["Web","UI","Forms","Deployment"],"project-portforge.jpeg","https://portforge.onrender.com/"],
  ["TraceMe","A privacy and content-exposure utility focused on locally detecting common PII and secret patterns without uploading the text.","security web",["Privacy","Security","Web"],"project-traceme.jpg","https://traceme-5w2o.onrender.com"],
  ["Gameverse","Interactive gaming web experience featuring browser-based experiences, dynamic visuals and a modern interface.","creative web",["JavaScript","UI","Interactive"],"project-gameverse.jpeg","https://gameverse-skrl.onrender.com/"],
  ["CosmoX","Interactive 3D Solar System experience designed for exploring planets and learning about space.","creative web",["3D","Web","Interactive"],"project-cosmox.jpg","https://cosmox-kn1j.onrender.com"],
  ["Personal Portfolio","Self-built developer portfolio presenting projects, certifications, technical interests and achievements.","web",["HTML","CSS","JavaScript"],"project-personal-portfolio.jpg","https://sarthakmehta.onrender.com"],
  ["AeroCast","Weather application created as a practical frontend project with a responsive interface.","web",["JavaScript","Weather","Responsive"],"project-aerocast.jpeg","https://aerocast-weather.onrender.com"],
  ["TaskFlow","Clean to-do list application focused on simple task creation and everyday productivity.","web",["Web","JavaScript","Productivity"],"project-taskflow.jpeg","https://taskflow-wt9o.onrender.com"],
  ["Simple Calendar","A live calendar web application for organizing and viewing dates and schedules.","web",["Web","JavaScript","UI"],"project-simple-calendar.jpg","https://simple-calendar-h75d.onrender.com/"],
  ["Student Management System","A web-based student management application for handling student information through a structured interface.","web",["Web","Management","CRUD"],"project-student-management.jpg","https://student-management-system-9grr.onrender.com/"],
  ["Library Management System","A live library management application designed around organizing library records and operations.","web",["Web","Management","CRUD"],"project-library-management.jpeg","https://library-management-system-pkai.onrender.com/"],
  ["SpendTrack","A personal expense-tracking web application for recording and monitoring spending.","web",["Web","Finance","Tracking"],"project-spendtrack.jpeg","https://spendtrack-1nr4.onrender.com"],
  ["QuizMaster","An interactive quiz application focused on answering questions and tracking quiz activity.","web",["Web","Quiz","Interactive"],"project-quizmaster.jpeg","https://quizmaster-mvkd.onrender.com"],
  ["SecureVault","A security-focused application for securely organizing and protecting sensitive information.","security web",["Security","Web","Privacy"],"project-securevault.jpeg","https://securevault-bdqz.onrender.com"],
  ["AuthHub","A web authentication project focused on account access and authentication workflows.","security web",["Authentication","Security","Web"],"project-authhub.jpeg","https://authhub-6bag.onrender.com"]
].map((p,i)=>({id:i+1,title:p[0],description:p[1],category:p[2],tags:p[3],image:p[4],live:p[5],featured:[0,1,2,13].includes(i)}));

const certificates = [
  ["ThinkNEXT Cyber Security Training","June 2 – July 2, 2026 · Grade A (Outstanding)","certificate9.jpeg","cyber","Completed a one-month industrial training focused on networking, Kali Linux, CIA triad, ethical hacking, penetration-testing phases and practical security tools including Nmap, Wireshark, EtherApe, BetterCap, Burp Suite, OWASP ZAP and Steghide."],
  ["Deloitte Cyber Job Simulation","Deloitte · Forage · Completed January 8, 2026","certificate8.jpeg","cyber","Completed a practical cybersecurity job simulation designed around professional cyber-work tasks and structured problem solving."],
  ["Tata Cybersecurity Analyst Job Simulation","Tata · Forage","certificate13.jpeg","cyber","Completed practical tasks involving Identity and Access Management (IAM), IAM strategy assessment, custom IAM solutions and platform integration."],
  ["Mastercard Cybersecurity Job Simulation","Mastercard · Forage","certificate14.jpeg","cyber","Completed practical tasks involving phishing-email simulation and interpreting phishing-simulation results."],
  ["AIG Shields Up Cybersecurity Job Simulation","AIG · Forage","certificate18.jpeg","cyber","Completed practical cybersecurity tasks focused on responding to zero-day vulnerabilities and technical ransomware scenarios."],
  ["PwC Cyber Security Consulting Job Simulation","PwC · Forage","certificate17.jpeg","cyber","Completed practical tasks covering risk assessment, SDLC walkthroughs, IT general controls testing and controls testing."],
  ["Datacom Cyber Security Operations Job Simulation","Datacom · Forage","certificate16.jpeg","cyber","Completed practical tasks covering cybersecurity fundamentals and cybersecurity risk assessment."],
  ["Commonwealth Bank Cybersecurity Job Simulation","Commonwealth Bank · Forage","certificate21.jpeg","cyber","Completed practical tasks involving data analysis, incident response, security awareness and penetration-testing concepts."],
  ["VaultofCodes Ethical Hacking & Cybersecurity Workshop","VaultofCodes","certificate20.jpeg","cyber","Completed a hands-on workshop covering reconnaissance, network scanning, Wi-Fi security, web vulnerabilities and cybersecurity fundamentals."],
  ["IBM SkillsBuild — Protecting a Device with Malwarebytes","IBM SkillsBuild","certificate19.jpeg","cyber","Completed learning focused on malware protection and securing devices against cyber threats using Malwarebytes."],
  ["NASSCOM — Yuva AI for All","Artificial Intelligence","certificate12.jpeg","ai","Completed the Yuva AI for All course, building foundational knowledge of artificial intelligence and its practical applications."],
  ["Python with AI","SkillEcted by JSSAV Edu. Pvt Ltd · Free Mini-Course","certificate24.jpeg","ai","Successfully completed the Python with AI mini-course through the SkillEcted Campus Program, fulfilling the course completion requirements."],
  ["Claude Code in Action","AI-assisted software development","certificate2.jpeg","ai","Learned AI-powered coding workflows, automation techniques and modern software-development practices using Claude AI."],
  ["Prompt Engineering Workshop","Generative AI","certificate3.jpeg","ai","Gained hands-on experience designing effective prompts for Large Language Models and generative AI systems."],
  ["Emerging Technologies Workshop","AI · Cybersecurity · Cloud · Digital Innovation","certificate7.jpeg","ai","Explored emerging trends in Artificial Intelligence, Cybersecurity, Cloud Computing and digital innovation."],
  ["Git & GitHub Bootcamp","Version control & collaboration","certificate5.jpeg","dev","Learned version control, collaboration workflows, repository management and open-source contribution practices."],
  ["Java Bootcamp","Java · Object-Oriented Programming","certificate4.jpeg","dev","Completed intensive training covering Java programming, object-oriented concepts and application development."],
  ["C++ Bootcamp","C++ · Problem solving","certificate6.jpeg","dev","Developed skills in C++ programming, data structures, problem-solving and algorithm implementation."],
  ["DigitAlchemy Global Hackathon 2026","75.03/100 · Rank 95/338 · 94.4% paper accuracy","certificate23.jpeg","other","Participated in the DigitAlchemy Global Hackathon 2026, achieving a 75.03/100 final score, 95th rank among 338 participants and 94.4% paper accuracy."],
  ["SkillCourse — 30 Days Power BI Micro Course","Data analysis · Visualization · Business Intelligence","certificate22.jpeg","other","Successfully completed a 30-day Power BI course covering data analysis, visualization and business-intelligence fundamentals."],
  ["Brand Monk Academy — UI/UX Webinar","UI/UX design","certificate15.jpeg","other","Participated in a UI/UX webinar and gained insights into user-interface design and user-experience principles."],
  ["ThinkNEXT Industrial Training","Industrial training","certificate1.jpeg","other","Completed industrial training with practical exposure to modern software-development technologies."],
  ["ThinkNEXT — Basics of Computer Training","June 2 – July 2, 2026 · Grade A (Outstanding)","certificate11.jpeg","other","Completed the Basics of Computer course at ThinkNEXT with Grade A (Outstanding)."],
  ["Think English — Spoken English Training","June 2 – July 2, 2026 · Grade A (Outstanding)","certificate10.jpeg","other","Completed the Think English spoken-English program at ThinkNEXT with Grade A (Outstanding)."]
].map((c,i)=>({id:i+1,title:c[0],meta:c[1],image:c[2],category:c[3],description:c[4]}));

function NetworkScene(){
  const group=React.useRef();
  useFrame((state)=>{
    if(group.current){
      group.current.rotation.y = state.clock.elapsedTime*0.035;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime*0.18)*0.05;
    }
  });
  return <group ref={group}>
    <Stars radius={35} depth={18} count={900} factor={1.1} saturation={0} fade speed={0.25}/>
    <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.35}>
      <mesh>
        <icosahedronGeometry args={[2.15,1]}/>
        <meshBasicMaterial color="#39ff14" wireframe transparent opacity={0.14}/>
      </mesh>
      <mesh scale={1.35}>
        <icosahedronGeometry args={[2.15,1]}/>
        <meshBasicMaterial color="#00d9ff" wireframe transparent opacity={0.045}/>
      </mesh>
    </Float>
    <pointLight color="#39ff14" intensity={12} distance={12}/>
  </group>
}

function ThreeHero(){
  return <div className="three-bg" aria-hidden="true">
    <Canvas camera={{position:[0,0,8],fov:55}}>
      <ambientLight intensity={0.3}/>
      <NetworkScene/>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false}/>
    </Canvas>
  </div>
}

function Modal({children,onClose}){
  useEffect(()=>{
    const fn=e=>e.key==="Escape"&&onClose();
    document.addEventListener("keydown",fn); return ()=>document.removeEventListener("keydown",fn);
  },[onClose]);
  return <div className="modal" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="modal-box"><button className="modal-close" onClick={onClose}>✕</button>{children}</div></div>
}

function App(){
  const [dark,setDark]=useState(()=>localStorage.getItem("portfolio-theme")!=="light");
  const [filter,setFilter]=useState("all");
  const [certFilter,setCertFilter]=useState("all");
  const [project,setProject]=useState(null);
  const [cert,setCert]=useState(null);
  const [terminal,setTerminal]=useState(["Sarthak Mehta Portfolio Terminal","Type help to see available commands."]);
  const [cmd,setCmd]=useState("");
  const [mobile,setMobile]=useState(false);
  const [typing,setTyping]=useState("");
  const phrases=["Cybersecurity-focused developer","Full-stack web builder","AI & ML project builder","Computer Science student","Ethical hacking learner"];
  const [pi,setPi]=useState(0);

  useEffect(()=>{document.body.classList.toggle("light",!dark);localStorage.setItem("portfolio-theme",dark?"dark":"light")},[dark]);
  useEffect(()=>{
    let i=0, deleting=false, timer;
    const run=()=>{
      const s=phrases[pi];
      setTyping(s.slice(0,i)+(i===s.length&&!deleting?"_":""));
      if(!deleting && i<s.length){i++;timer=setTimeout(run,70)}
      else if(!deleting){deleting=true;timer=setTimeout(run,1300)}
      else if(i>0){i--;timer=setTimeout(run,42)}
      else{deleting=false;setPi(v=>(v+1)%phrases.length);timer=setTimeout(run,70)}
    };
    run(); return ()=>clearTimeout(timer);
  },[pi]);

  const filteredProjects=useMemo(()=>projects.filter(p=>filter==="all"||p.category.split(" ").includes(filter)),[filter]);
  const filteredCerts=useMemo(()=>certificates.filter(c=>certFilter==="all"||c.category===certFilter),[certFilter]);

  const commands={
    help:"Available: help, whoami, projects, skills, about, resume, github, linkedin, contact, clear",
    whoami:"Sarthak Mehta — Computer Science Student | Developer | Cybersecurity Enthusiast",
    projects:projects.map(p=>p.title).join(" | "),
    skills:"C, C++, Java, Python, JavaScript, SQL, HTML, CSS, Flask, Linux, Networking, Git, GitHub",
    about:"Diploma in Computer Science at SLIET (2024–2027). Interested in cybersecurity, software development and practical projects.",
    resume:"Open the Download Resume button in the hero section to download sarthak.pdf.",
    github:"https://github.com/sarthakmehta7",
    linkedin:"https://www.linkedin.com/in/sarthak-mehta-5693493a5",
    contact:"Email: sarthakmehta.wca@gmail.com | Phone: 6284711230"
  };

  function runCommand(e){
    e.preventDefault();
    const value=cmd.trim().toLowerCase();
    if(!value)return;
    if(value==="clear"){setTerminal([]);setCmd("");return}
    setTerminal(t=>[...t,`> ${value}`,commands[value]||'Command not found. Type "help".']);
    setCmd("");
  }

  return <div className={dark?"app":"app light"}>
    <ThreeHero/>
    <header><div className="container nav"><a className="logo" href="#home">Sarthak<span>.dev</span></a><nav>{["home","projects","skills","timeline","certificates","contact"].map(x=><a key={x} href={"#"+x}>{x[0].toUpperCase()+x.slice(1)}</a>)}</nav><div className="nav-actions"><button onClick={()=>setDark(v=>!v)} className="icon-btn">{dark?"☼":"☾"}</button><button className="menu-btn" onClick={()=>setMobile(v=>!v)}>☰</button></div></div>{mobile&&<div className="mobile-nav">{["home","projects","skills","timeline","certificates","contact"].map(x=><a onClick={()=>setMobile(false)} key={x} href={"#"+x}>{x}</a>)}</div>}</header>

    <main>
      <section id="home" className="hero container">
        <div className="hero-copy">
          <div className="eyebrow"><span className="dot"/> Available for opportunities</div>
          <h1>Hi, I'm <span>Sarthak</span><br/><b>Mehta.</b></h1>
          <p>Computer Science student building practical cybersecurity, AI and full-stack web applications.</p>
          <div className="typing">{typing}</div>
          <div className="actions"><a className="btn primary" href="#projects">View Projects →</a><a className="btn" download href="/sarthak.pdf">Download Resume ↓</a></div>
          <div className="socials"><a href="https://github.com/sarthakmehta7" target="_blank">GH</a><a href="https://www.linkedin.com/in/sarthak-mehta-5693493a5" target="_blank">in</a><a href="mailto:sarthakmehta.wca@gmail.com">@</a></div>
        </div>
        <div className="hero-card"><img src="/sarthak.jpeg" alt="Sarthak Mehta"/><div className="mini-terminal"><b>user@portfolio</b>:~$ whoami<br/>Sarthak Mehta<br/><b>user@portfolio</b>:~$ status<br/><span>● building practical projects</span></div></div>
      </section>

      <section id="projects" className="section"><div className="container">
        <div className="section-head"><div><small>01 / Work</small><h2>Featured Projects</h2></div><p>A selection of practical applications, security tools and interactive web experiences.</p></div>
        <div className="filters">{["all","security","ai","web","creative"].map(f=><button key={f} onClick={()=>setFilter(f)} className={filter===f?"active":""}>{f==="all"?"All":f==="security"?"Cybersecurity":f==="ai"?"AI / ML":f==="web"?"Web Development":"Interactive"}</button>)}</div>
        <div className="projects">{filteredProjects.map(p=><motion.article layout key={p.id} className="project" onClick={()=>setProject(p)}><div className="cover">{p.featured&&<span className="featured">FEATURED</span>}<img src={"/projects/"+p.image} alt={p.title} onError={e=>e.currentTarget.style.display="none"}/><span className="num">{String(p.id).padStart(2,"0")}</span></div><div className="project-body"><h3>{p.title}</h3><p>{p.description}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div><div className="project-links"><button onClick={e=>{e.stopPropagation();setProject(p)}}>Details</button><a onClick={e=>e.stopPropagation()} href={p.live} target="_blank">Live Demo</a></div></div></motion.article>)}</div>
      </div></section>

      <section id="about" className="section"><div className="container"><div className="section-head"><div><small>02 / Profile</small><h2>About Me</h2></div><p>A student developer focused on learning by building.</p></div><div className="two-col"><div className="card"><p>I'm pursuing a Diploma in Computer Science at SLIET (2024–2027). My interests include cybersecurity, programming, web development, networking, ethical hacking and emerging technologies.</p><br/><p>I prefer practical learning: building applications, experimenting with security concepts and improving my development workflow through real projects.</p></div><div className="stats"><div><b>2024–27</b><span>Diploma in Computer Science</span></div><div><b>15+</b><span>Live / portfolio projects</span></div><div><b>24+</b><span>Certificates & achievements</span></div></div></div></div></section>

      <section id="skills" className="section"><div className="container"><div className="section-head"><div><small>03 / Toolkit</small><h2>Technology Stack</h2></div><p>Grouped by what I use and explore.</p></div><div className="skill-groups">{[["LANGUAGES",["C","C++","Java","Python","JavaScript","SQL"]],["WEB DEVELOPMENT",["HTML","CSS","JavaScript","Flask","REST APIs","Responsive Design"]],["CYBERSECURITY",["Networking","Linux","Ethical Hacking","Phishing Analysis","Penetration Testing"]],["TOOLS & PLATFORM",["Git","GitHub","VS Code","Render","Kali Linux","Burp Suite","Nmap"]]].map(g=><div className="skill-group" key={g[0]}><h3>{g[0]}</h3><div>{g[1].map(s=><span key={s}>{s}</span>)}</div></div>)}</div></div></section>

      <section id="timeline" className="section"><div className="container"><div className="section-head"><div><small>04 / Journey</small><h2>Learning Timeline</h2></div><p>A quick view of the path behind the projects.</p></div><div className="card timeline">{[["2024","Started Diploma in Computer Science","Began the Diploma in Computer Science at SLIET."],["2025","Expanded Web Development","Built practical browser-based applications and explored frontend development."],["2026","Cybersecurity Training","Completed industrial training with practical exposure to networking, Linux and cybersecurity concepts."],["2026","Built PhishGuard AI","Developed a security-focused URL analysis project combining ML-oriented features with technical URL indicators."],["2026","Hackathon & Project Building","Continued building and deploying practical applications while participating in technical learning activities."]].map(e=><div className="event" key={e[0]+e[1]}><time>{e[0]}</time><h3>{e[1]}</h3><p>{e[2]}</p></div>)}</div></div></section>

      <section id="github" className="section"><div className="container"><div className="section-head"><div><small>05 / Open Source</small><h2>GitHub</h2></div><p>Explore my repositories, source code and ongoing experiments.</p></div><div className="card github"><div><h3>github.com/sarthakmehta7</h3><p>Repository information can be explored directly on GitHub.</p></div><a className="btn primary" href="https://github.com/sarthakmehta7" target="_blank">Open GitHub ↗</a></div></div></section>

      <section id="terminal" className="section"><div className="container"><div className="section-head"><div><small>06 / Interactive</small><h2>Portfolio Terminal</h2></div><p>Try <code>help</code>, <code>projects</code>, <code>skills</code> or <code>contact</code>.</p></div><div className="terminal"><div className="term-bar">● ● ● <span>sarthak@portfolio:~</span></div><div className="term-output">{terminal.map((x,i)=><div key={i} className={x.startsWith(">")||x.startsWith("Sarthak")?"green":""}>{x}</div>)}</div><form onSubmit={runCommand} className="command"><span>&gt;</span><input value={cmd} onChange={e=>setCmd(e.target.value)} placeholder="type a command..." autoComplete="off"/></form></div></div></section>

      <section id="certificates" className="section"><div className="container"><div className="section-head"><div><small>07 / Credentials</small><h2>Certificates & Achievements <em>24</em></h2></div><p>24 credentials. Click any card to view it larger.</p></div><div className="filters">{["all","cyber","ai","dev","other"].map(f=><button key={f} onClick={()=>setCertFilter(f)} className={certFilter===f?"active":""}>{f==="all"?"All 24":f==="cyber"?"Cybersecurity":f==="ai"?"AI / Tech":f==="dev"?"Development":"Other"}</button>)}</div><div className="certificates">{filteredCerts.map(c=><article className="certificate" key={c.id} onClick={()=>setCert(c)}><img src={"/certificates/"+c.image} alt={c.title}/><div><strong>{c.title}</strong><small>{c.meta}</small><p>{c.description}</p><span>VIEW CERTIFICATE ↗</span></div></article>)}</div></div></section>

      <section id="contact" className="section"><div className="container"><div className="section-head"><div><small>08 / Contact</small><h2>Let's Connect</h2></div><p>For projects, collaboration, internships, learning opportunities or technical conversations.</p></div><div className="contact-grid"><div className="card"><h3>Contact details</h3><p>I'm open to connecting around software development, cybersecurity and practical project work.</p><div className="contact-links"><a href="mailto:sarthakmehta.wca@gmail.com">✉ sarthakmehta.wca@gmail.com</a><a href="tel:+916284711230">☎ 6284711230</a><a href="https://www.linkedin.com/in/sarthak-mehta-5693493a5" target="_blank">in LinkedIn</a><a href="https://github.com/sarthakmehta7" target="_blank">⌘ GitHub</a></div></div><div className="card"><form onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);location.href=`mailto:sarthakmehta.wca@gmail.com?subject=${encodeURIComponent("Portfolio message from "+f.get("name"))}&body=${encodeURIComponent("Name: "+f.get("name")+"\nEmail: "+f.get("email")+"\n\n"+f.get("message"))}`}}><label>NAME<input name="name" required placeholder="Your name"/></label><label>EMAIL<input type="email" name="email" required placeholder="your@email.com"/></label><label>MESSAGE<textarea name="message" required placeholder="Write your message..."/></label><button className="btn primary">Send Message →</button></form></div></div></div></section>
    </main>
    <footer>© 2026 Sarthak Mehta · Built with React & Three.js · <a href="#home">Back to top ↑</a></footer>

    <AnimatePresence>{project&&<Modal onClose={()=>setProject(null)}><div className="kicker">PROJECT PREVIEW</div><img className="modal-image" src={"/projects/"+project.image} alt={project.title}/><h2>{project.title}</h2><p>{project.description}</p><div className="tags">{project.tags.map(t=><span key={t}>{t}</span>)}</div><a className="btn primary" href={project.live} target="_blank">Open Live Project ↗</a></Modal>}{cert&&<Modal onClose={()=>setCert(null)}><img className="cert-large" src={"/certificates/"+cert.image} alt={cert.title}/><div className="kicker">CREDENTIAL DETAILS</div><h2>{cert.title}</h2><small>{cert.meta}</small><p>{cert.description}</p></Modal>}</AnimatePresence>
  </div>
}

createRoot(document.getElementById("root")).render(<App />);
