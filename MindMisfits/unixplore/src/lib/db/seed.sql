-- Seed data for UniXplore
-- This includes SOA/ITER college and Silicon Institute of Technology

-- Insert SOA University
INSERT INTO colleges (college_id, name, location, city, state, official_website, official_email, status)
VALUES (
  'CLG-SOAITER',
  'Siksha ''O'' Anusandhan (SOA) - Institute of Technical Education and Research (ITER)',
  'Bhubaneswar, Odisha',
  'Bhubaneswar',
  'Odisha',
  'https://www.soa.ac.in',
  'info@soa.ac.in',
  'active'
);

-- Insert Silicon Institute of Technology
INSERT INTO colleges (college_id, name, location, city, state, official_website, official_email, status)
VALUES (
  'CLG-SILICON',
  'Silicon Institute of Technology',
  'Bhubaneswar, Odisha',
  'Bhubaneswar',
  'Odisha',
  'https://silicon.ac.in',
  'info@silicon.ac.in',
  'active'
);

-- Insert college admin for SOA (password: Admin@123)
INSERT INTO college_admins (college_id, email, password_hash)
VALUES (
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'admin@soa.ac.in',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILNv.3npu'
);

-- Insert college admin for Silicon (password: Admin@123)
INSERT INTO college_admins (college_id, email, password_hash)
VALUES (
  (SELECT id FROM colleges WHERE college_id = 'CLG-SILICON'),
  'admin@silicon.ac.in',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILNv.3npu'
);

-- Insert all clubs for SOA/ITER

-- Technical Clubs
INSERT INTO clubs (college_id, name, slug, category_id, email, description, about, status)
VALUES
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'Google Developer Group (GDG) - ITER Chapter',
  'gdg-iter',
  (SELECT id FROM categories WHERE slug = 'technical'),
  'gdg@iter.ac.in',
  'An official Google-backed technical community dedicated to empowering students through technology.',
  'The GDG Club of ITER is an official Google-backed technical community dedicated to empowering students through technology. We conduct regular coding contests, hands-on workshops, hackathons, and developer events that help students build real-world skills. GDG serves as a launchpad for career growth by providing industry exposure, collaboration opportunities, and mentorship from experienced developers. Joining GDG means stepping into a community that learns, builds, and innovates together.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'CODEX',
  'codex',
  (SELECT id FROM categories WHERE slug = 'technical'),
  'codex@iter.ac.in',
  'The first and only official programming club of ITER, SOA - a hub where innovation meets determination.',
  'Codex is the first and only official programming club of ITER, SOA - a hub where innovation meets determination. At Codex, we are more than just coders; we are dreamers, creators, and relentless problem-solvers. Our journey is not merely about writing lines of code but about embracing the grind—trying, failing, learning, and repeating until we achieve excellence or stumble upon brilliance amidst the chaos. The walls of our club room resonate with the energy of countless breakthroughs, where raw ideas evolve into groundbreaking projects and aspiring programmers emerge as confident developers, equipped to face the challenges of the real world. With each new generation of coders, we take pride in nurturing talent and fostering a passion for technology. Our ultimate project isn''t just software or applications; it''s something far greater—a community of exceptional programmers who are ready to innovate, inspire, and lead the future of technology. We are Codex. We code. We explore.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'Coding Ninjas 10x Club (CN10x)',
  'cn10x',
  (SELECT id FROM categories WHERE slug = 'technical'),
  'cn10x@iter.ac.in',
  'A student-led technical community powered by Coding Ninjas, designed to help learners upgrade their coding skills.',
  'Coding Ninjas 10x Club - ITER Chapter. The CN 10x Club of ITER is a student-led technical community powered by Coding Ninjas, designed to help learners upgrade their coding skills and unlock their full potential. The club regularly hosts coding challenges, expert sessions, mentorship programs, hackathons, and industry-oriented workshops. CN 10x provides a collaborative environment where students learn, build, network, and grow together. It plays a crucial role in boosting technical confidence and preparing students for internships, placements, and a strong career in tech.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'Innovation & Entrepreneurship Cell (E-Cell SOA)',
  'ecell-soa',
  (SELECT id FROM categories WHERE slug = 'technical'),
  'ecell@soa.ac.in',
  'A vibrant student community dedicated to cultivating innovation, leadership, and entrepreneurial thinking.',
  'The E-Cell of ITER is a vibrant student community dedicated to cultivating innovation, leadership, and entrepreneurial thinking on campus. Powered by dynamic events like ideathons, startup challenges, workshops, and mentorship programs, E-Cell helps students transform ideas into impactful ventures. It serves as a launchpad for aspiring founders, providing resources, industry exposure, and a supportive ecosystem to develop problem-solving and startup-building skills. At E-Cell, creativity meets opportunity—empowering students to become the innovators of tomorrow.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'ITER Robotics Club (IRC)',
  'irc',
  (SELECT id FROM categories WHERE slug = 'technical'),
  'irc@iter.ac.in',
  'A dynamic technical community where innovation meets engineering excellence.',
  'The ITER Robotics Club is a dynamic technical community where innovation meets engineering excellence. IRC gives students hands-on exposure to robotics, automation, IoT, electronics, and mechanical design through workshops, competitions, and real-time project building. From Robo Race and Robo Sumo to advanced robotics challenges, the club offers a platform to learn, experiment, and compete. With dedicated technical teams and mentorship, IRC helps students sharpen problem-solving skills, cultivate technical mastery, and prepare for careers in cutting-edge technology. At IRC, gears turn, ideas ignite, and future innovators are built—one bot at a time.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'SOA Flying Community (SFC)',
  'sfc',
  (SELECT id FROM categories WHERE slug = 'technical'),
  'sfc@soa.ac.in',
  'A dedicated hub for drone, aviation, and tech enthusiasts across SOA University.',
  'The SOA Flying Community is a dedicated hub for drone, aviation, and tech enthusiasts across SOA University. SFC provides a hands-on platform for students to explore drone engineering, aerial cinematography, FPV flying, simulations, and real-world drone applications. Through workshops, drone races, flying sessions, expert talks, and collaborative events, the community helps students master both technical and creative aspects of drone technology. SFC cultivates innovation, precision, and teamwork—empowering students to build, fly, and experiment while preparing for emerging careers in robotics, UAV systems, and aerial tech. At SFC, the sky isn''t the limit—it''s the playground.',
  'approved'
);

-- Cultural Clubs
INSERT INTO clubs (college_id, name, slug, category_id, email, description, about, status)
VALUES
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'SOA Danza',
  'soa-danza',
  (SELECT id FROM categories WHERE slug = 'cultural'),
  'danza@soa.ac.in',
  'The official Western & Street Dance Club of SOA University, known for high-energy performances.',
  'SOA Danza is the official Western & Street Dance Club of SOA University, known for its high-energy performances and award-winning choreography. The club actively performs at major cultural events, fests, and special occasions across campus, while also representing SOA at inter-college competitions. With regular workshops, auditions, and team practices, Danza provides students a vibrant space to grow, express, and shine through dance.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'Vogue',
  'vogue',
  (SELECT id FROM categories WHERE slug = 'cultural'),
  'vogue@soa.ac.in',
  'The official fashion and ramp club of SOA University, celebrating creativity, confidence, and high-fashion expression.',
  'Vogue is the official fashion and ramp club of SOA University, celebrating creativity, confidence, and high-fashion expression. From runway shows and theme-based fashion fusions to grooming sessions and personality refinement workshops, Vogue actively leads SOA''s cultural scene with style. The club regularly performs at major university events and has earned multiple awards in inter-college fashion competitions, establishing itself as a powerhouse of talent, innovation, and elegance.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'ODANZA',
  'odanza',
  (SELECT id FROM categories WHERE slug = 'cultural'),
  'odanza@soa.ac.in',
  'The official Classical Dance Society of SOA University, celebrating India''s rich heritage.',
  'ODANZA is the official Classical Dance Society of SOA University, celebrating India''s rich heritage through classical, semi-classical, and folk dance forms. Known for its graceful performances, cultural showcases, and event appearances, the club brings tradition to life on the biggest SOA stages. With regular workshops, stage productions, and award-winning performances, ODANZA offers students a platform to express artistry, discipline, and devotion through classical dance.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'Toneelstuk (TSK)',
  'toneelstuk',
  (SELECT id FROM categories WHERE slug = 'cultural'),
  'tsk@soa.ac.in',
  'The official dramatics and theatre club of SOA University, bringing stories to life.',
  'Toneelstuk is the official dramatics and theatre club of SOA University, bringing stories to life through stage plays, nukkad natak, mime, and creative filmmaking. Known for its powerful performances and thought-provoking productions, the club plays a major role in cultural events, festivals, and inter-college competitions. With regular acting workshops, scriptwriting sessions, and stage training, Toneelstuk offers students a vibrant platform to express emotion, creativity, and artistry on and off the stage.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'SOA Music Club (SMC)',
  'smc',
  (SELECT id FROM categories WHERE slug = 'cultural'),
  'smc@soa.ac.in',
  'The official music club of SOA University, uniting singers, instrumentalists, and music lovers.',
  'SMC is the official music club of SOA University, uniting singers, instrumentalists, and music lovers under one vibrant stage. From acoustic nights and jamming sessions to grand cultural performances and inter-college competitions, SMC brings the campus to life with rhythm and passion. With regular auditions, collaborations, and live showcases, the club gives students a platform to experiment, perform, and grow as artists.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'Srishti',
  'srishti',
  (SELECT id FROM categories WHERE slug = 'cultural'),
  'srishti@soa.ac.in',
  'The official art and creative club of SOA University, where imagination meets expression.',
  'Srishti is the official art and creative club of SOA University, where imagination meets expression. From canvas painting, sketching, wall art, and live exhibits to cultural showcases and creative workshops, Srishti adds colour and artistry to every major campus event. The club provides a vibrant space for artists to explore, experiment, and bring ideas to life—brushing beyond boundaries with every stroke.',
  'approved'
);

-- Media Clubs
INSERT INTO clubs (college_id, name, slug, category_id, email, description, about, status)
VALUES
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'SOA Photography Club (SPC)',
  'spc',
  (SELECT id FROM categories WHERE slug = 'media'),
  'spc@soa.ac.in',
  'The official media powerhouse of SOA University, capturing every moment with unmatched precision.',
  'SPC is the official media powerhouse of SOA University, capturing every moment with unmatched precision. From professional photography and event coverage to creative edits and campus storytelling—we turn memories into masterpieces. SPC is SOA''s central media team, dedicated to freezing moments, framing emotions, and presenting the soul of every event. With a passionate crew of photographers, editors, and content creators, we bring the campus to life—one frame at a time.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'Virtual Showreel (VSR)',
  'vsr',
  (SELECT id FROM categories WHERE slug = 'media'),
  'vsr@soa.ac.in',
  'SOA''s official broadcasting & cinematography team, turning stories into stunning visuals.',
  'Virtual Showreel is SOA''s official broadcasting & cinematography team, turning stories into stunning visuals. From cinematic videos to creative productions—we capture beyond the limit. Virtual Showreel is the heartbeat of SOA''s visual production community. Armed with cameras, rigs, lights, mics, and a creative vision, we transform ideas into cinematic masterpieces. We don''t just film—we create experiences.',
  'approved'
);

-- Social Clubs
INSERT INTO clubs (college_id, name, slug, category_id, email, description, about, status)
VALUES
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'JAAGO',
  'jaago',
  (SELECT id FROM categories WHERE slug = 'social'),
  'jaago@soa.ac.in',
  'The social initiative wing of SOA, dedicated to uplifting communities through compassion and action.',
  'JAAGO is the social initiative wing of SOA, dedicated to uplifting communities through compassion and action. From donation drives and educational support to charitable outreach and joyful events for differently-abled children, JAAGO works to bring real change where it matters most. It''s not just a club—it''s a movement towards a better future. JAAGO stands as SOA''s heartbeat of social service—a movement committed to spreading hope. Whether through donations, charity work, village outreach, or fun-filled activities for specially-abled children, JAAGO strives to touch lives with kindness and purpose.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'National Cadet Corps (NCC) SOA',
  'ncc-soa',
  (SELECT id FROM categories WHERE slug = 'social'),
  'ncc@soa.ac.in',
  'Part of the prestigious National Cadet Corps, dedicated to shaping disciplined, responsible citizens.',
  'NCC SOA is not just a club—it is a part of the prestigious National Cadet Corps, a national organization dedicated to shaping disciplined, responsible, and service-oriented citizens. Through drills, camps, social service, and leadership training, NCC SOA instills unity, courage, and a commitment to serve the nation. A proud part of the National Cadet Corps. Not a club, but a national uniformed organization dedicated to discipline, social service, leadership, and nation-building.',
  'approved'
);

-- Sports Clubs
INSERT INTO clubs (college_id, name, slug, category_id, email, description, about, status)
VALUES
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'SOA Badminton Club',
  'badminton',
  (SELECT id FROM categories WHERE slug = 'sports'),
  'badminton@soa.ac.in',
  'A dedicated space for shuttle enthusiasts, focusing on refining technique and improving agility.',
  'A dedicated space for shuttle enthusiasts, the club focuses on refining technique, improving agility, and participating in inter-college badminton tournaments. The SOA Badminton Club is part of the central hub for all athletic activities on campus, promoting fitness, teamwork, and competitive spirit.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'SOA Basketball Club',
  'basketball',
  (SELECT id FROM categories WHERE slug = 'sports'),
  'basketball@soa.ac.in',
  'Built on teamwork and fast-paced gameplay, training players to master court strategies.',
  'Built on teamwork and fast-paced gameplay, this club trains players to master court strategies and represent SOA in major basketball leagues. The SOA Basketball Club brings together multiple sports communities, offering students the platform to train, compete, and excel.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'SOA Football Club',
  'football',
  (SELECT id FROM categories WHERE slug = 'sports'),
  'football@soa.ac.in',
  'Uniting passionate footballers, fostering discipline and skill.',
  'The club unites passionate footballers, fostering discipline and skill while competing in university and state-level matches with a strong team spirit. The SOA Football Club is part of the central hub for all athletic activities on campus.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'SOA Table Tennis Club',
  'table-tennis',
  (SELECT id FROM categories WHERE slug = 'sports'),
  'tabletennis@soa.ac.in',
  'Home to quick reflexes and precision play.',
  'Home to quick reflexes and precision play, the TT club helps students hone competitive techniques and participate in regular intra- and inter-college events. The SOA Table Tennis Club promotes fitness, teamwork, and competitive spirit.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SOAITER'),
  'SOA Cricket Club',
  'cricket',
  (SELECT id FROM categories WHERE slug = 'sports'),
  'cricket@soa.ac.in',
  'A powerhouse for cricket lovers, nurturing batting, bowling, and fielding talent.',
  'A powerhouse for cricket lovers, the club nurtures batting, bowling, and fielding talent while preparing teams for major tournaments and campus leagues. The SOA Cricket Club is part of the central sports hub on campus.',
  'approved'
);

-- Insert Silicon Clubs
INSERT INTO clubs (college_id, name, slug, category_id, email, description, about, status)
VALUES
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SILICON'),
  'Silicon Tech Club',
  'silicon-tech',
  (SELECT id FROM categories WHERE slug = 'technical'),
  'tech@silicon.ac.in',
  'The official technical club of Silicon Institute of Technology.',
  'Fostering innovation and technical skills among students through workshops and hackathons.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SILICON'),
  'Silicon Cultural Club',
  'silicon-cultural',
  (SELECT id FROM categories WHERE slug = 'cultural'),
  'cultural@silicon.ac.in',
  'Celebrating the diverse culture and artistic talents of Silicon students.',
  'Organizing cultural events, dance competitions, and music fests.',
  'approved'
),
(
  (SELECT id FROM colleges WHERE college_id = 'CLG-SILICON'),
  'Silicon Sports Club',
  'silicon-sports',
  (SELECT id FROM categories WHERE slug = 'sports'),
  'sports@silicon.ac.in',
  'Promoting sportsmanship and fitness through various sports activities.',
  'Managing all sports events and teams at Silicon Institute of Technology.',
  'approved'
);

-- Add sample club admins (password: Club@123)
INSERT INTO club_admins (club_id, name, email, password_hash)
SELECT 
  id,
  'Admin',
  email,
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILNv.3npu'
FROM clubs;

-- Add sample announcements for a few clubs
INSERT INTO announcements (club_id, title, content, published)
VALUES
(
  (SELECT id FROM clubs WHERE slug = 'gdg-iter'),
  'Welcome to GDG ITER!',
  '<p>We are excited to welcome all new members to the Google Developer Group at ITER! Join us for our upcoming orientation session where we will discuss our roadmap for this semester, upcoming events, and how you can get involved.</p><p>Stay tuned for more updates!</p>',
  true
),
(
  (SELECT id FROM clubs WHERE slug = 'codex'),
  'Codex Recruitment 2025',
  '<p>Codex is now open for recruitment! We are looking for passionate programmers who want to learn, build, and innovate together.</p><p>Applications are now open. Visit our website for more details.</p>',
  true
),
(
  (SELECT id FROM clubs WHERE slug = 'soa-danza'),
  'Danza Auditions',
  '<p>SOA Danza is conducting auditions for new members! If you have a passion for dance and want to be part of our award-winning team, this is your chance.</p><p>Date: TBA<br>Venue: Main Auditorium</p>',
  true
);

