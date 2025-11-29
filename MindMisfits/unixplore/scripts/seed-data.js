const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:krrish601@localhost:5432/unixplore',
});

const soaClubs = {
    technical: [
        {
            name: 'Google Developer Group (GDG) - ITER Chapter',
            slug: 'gdg-iter',
            email: 'gdg@iter.ac.in',
            description: 'Official Google-backed technical community empowering students through technology.',
            about: `The GDG Club of ITER is an official Google-backed technical community dedicated to empowering students through technology. We conduct regular coding contests, hands-on workshops, hackathons, and developer events that help students build real-world skills. GDG serves as a launchpad for career growth by providing industry exposure, collaboration opportunities, and mentorship from experienced developers. Joining GDG means stepping into a community that learns, builds, and innovates together.`,
            website: 'https://gdg.community.dev/gdg-on-campus-institute-of-technical-education-research-bhubaneswar-india/',
        },
        {
            name: 'CODEX',
            slug: 'codex',
            email: 'codex@iter.ac.in',
            description: 'The first and only official programming club of ITER, SOA - where innovation meets determination.',
            about: `Codex is the first and only official programming club of ITER, SOA - a hub where innovation meets determination. At Codex, we are more than just coders; we are dreamers, creators, and relentless problem-solvers. Our journey is not merely about writing lines of code but about embracing the grind—trying, failing, learning, and repeating until we achieve excellence or stumble upon brilliance amidst the chaos. The walls of our club room resonate with the energy of countless breakthroughs, where raw ideas evolve into groundbreaking projects and aspiring programmers emerge as confident developers, equipped to face the challenges of the real world. With each new generation of coders, we take pride in nurturing talent and fostering a passion for technology. Our ultimate project isn’t just software or applications; it’s something far greater—a community of exceptional programmers who are ready to innovate, inspire, and lead the future of technology. We are Codex. We code. We explore.`,
            website: 'https://codexstart.vercel.app/',
        },
        {
            name: 'CN10x - Coding Ninjas 10x Club',
            slug: 'cn10x',
            email: 'cn10x@iter.ac.in',
            description: 'Student-led technical community powered by Coding Ninjas.',
            about: `Coding Ninjas 10x Club - ITER Chapter. The CN 10x Club of ITER is a student-led technical community powered by Coding Ninjas, designed to help learners upgrade their coding skills and unlock their full potential. The club regularly hosts coding challenges, expert sessions, mentorship programs, hackathons, and industry-oriented workshops. CN 10x provides a collaborative environment where students learn, build, network, and grow together. It plays a crucial role in boosting technical confidence and preparing students for internships, placements, and a strong career in tech.`,
            website: 'https://cnxiter.vercel.app/',
        },
        {
            name: 'Innovation & Entrepreneurship Cell - ITER (E-Cell SOA)',
            slug: 'ecell-soa',
            email: 'ecell@soa.ac.in',
            description: 'Vibrant student community cultivating innovation, leadership, and entrepreneurial thinking.',
            about: `The E-Cell of ITER is a vibrant student community dedicated to cultivating innovation, leadership, and entrepreneurial thinking on campus. Powered by dynamic events like ideathons, startup challenges, workshops, and mentorship programs, E-Cell helps students transform ideas into impactful ventures. It serves as a launchpad for aspiring founders, providing resources, industry exposure, and a supportive ecosystem to develop problem-solving and startup-building skills. At E-Cell, creativity meets opportunity - empowering students to become the innovators of tomorrow.`,
            website: 'https://linktr.ee/IEC_SOA',
        },
        {
            name: 'ITER Robotics Club (IRC)',
            slug: 'irc',
            email: 'robotics@iter.ac.in',
            description: 'Dynamic technical community where innovation meets engineering excellence in robotics.',
            about: `The ITER Robotics Club is a dynamic technical community where innovation meets engineering excellence. IRC gives students hands-on exposure to robotics, automation, IoT, electronics, and mechanical design through workshops, competitions, and real-time project building. From Robo Race and Robo Sumo to advanced robotics challenges, the club offers a platform to learn, experiment, and compete. With dedicated technical teams and mentorship, IRC helps students sharpen problem-solving skills, cultivate technical mastery, and prepare for careers in cutting-edge technology. At IRC, gears turn, ideas ignite, and future innovators are built—one bot at a time.`,
        },
        {
            name: 'SOA Flying Community (SFC)',
            slug: 'sfc',
            email: 'flying@soa.ac.in',
            description: 'Dedicated hub for drone, aviation, and tech enthusiasts exploring UAV systems.',
            about: `The SOA Flying Community is a dedicated hub for drone, aviation, and tech enthusiasts across SOA University. SFC provides a hands-on platform for students to explore drone engineering, aerial cinematography, FPV flying, simulations, and real-world drone applications. Through workshops, drone races, flying sessions, expert talks, and collaborative events, the community helps students master both technical and creative aspects of drone technology. SFC cultivates innovation, precision, and teamwork—empowering students to build, fly, and experiment while preparing for emerging careers in robotics, UAV systems, and aerial tech. At SFC, the sky isn’t the limit—it’s the playground.`,
        }
    ],
    cultural: [
        {
            name: 'SOA Danza',
            slug: 'danza',
            email: 'danza@soa.ac.in',
            description: 'Official Western & Street Dance Club of SOA University.',
            about: `SOA Danza is the official Western & Street Dance Club of SOA University, known for its high-energy performances and award-winning choreography. The club actively performs at major cultural events, fests, and special occasions across campus, while also representing SOA at inter-college competitions. With regular workshops, auditions, and team practices, Danza provides students a vibrant space to grow, express, and shine through dance.`,
        },
        {
            name: 'Vogue - SOA Fashion Club',
            slug: 'vogue',
            email: 'vogue@soa.ac.in',
            description: 'Official fashion and ramp club celebrating creativity and confidence.',
            about: `Vogue is the official fashion and ramp club of SOA University, celebrating creativity, confidence, and high-fashion expression. From runway shows and theme-based fashion fusions to grooming sessions and personality refinement workshops, Vogue actively leads SOA's cultural scene with style. The club regularly performs at major university events and has earned multiple awards in inter-college fashion competitions, establishing itself as a powerhouse of talent, innovation, and elegance.`,
        },
        {
            name: 'ODANZA',
            slug: 'odanza',
            email: 'odanza@soa.ac.in',
            description: 'Official Classical Dance Society celebrating India\'s rich heritage.',
            about: `ODANZA is the official Classical Dance Society of SOA University, celebrating India's rich heritage through classical, semi-classical, and folk dance forms. Known for its graceful performances, cultural showcases, and event appearances, the club brings tradition to life on the biggest SOA stages. With regular workshops, stage productions, and award-winning performances, ODANZA offers students a platform to express artistry, discipline, and devotion through classical dance.`,
        },
        {
            name: 'Toneelstuk (TSK) - SOA Dramatics Society',
            slug: 'tsk',
            email: 'tsk@soa.ac.in',
            description: 'Official dramatics and theatre club bringing stories to life.',
            about: `Toneelstuk is the official dramatics and theatre club of SOA University, bringing stories to life through stage plays, nukkad natak, mime, and creative filmmaking. Known for its powerful performances and thought-provoking productions, the club plays a major role in cultural events, festivals, and inter-college competitions. With regular acting workshops, scriptwriting sessions, and stage training, Toneelstuk offers students a vibrant platform to express emotion, creativity, and artistry on and off the stage.`,
        },
        {
            name: 'SMC - SOA Music Club',
            slug: 'smc',
            email: 'music@soa.ac.in',
            description: 'Official music club uniting singers, instrumentalists, and music lovers.',
            about: `SMC is the official music club of SOA University, uniting singers, instrumentalists, and music lovers under one vibrant stage. From acoustic nights and jamming sessions to grand cultural performances and inter-college competitions, SMC brings the campus to life with rhythm and passion. With regular auditions, collaborations, and live showcases, the club gives students a platform to experiment, perform, and grow as artists.`,
        },
        {
            name: 'Srishti - SOA Art Club',
            slug: 'srishti',
            email: 'art@soa.ac.in',
            description: 'Official art and creative club where imagination meets expression.',
            about: `Srishti is the official art and creative club of SOA University, where imagination meets expression. From canvas painting, sketching, wall art, and live exhibits to cultural showcases and creative workshops, Srishti adds colour and artistry to every major campus event. The club provides a vibrant space for artists to explore, experiment, and bring ideas to life—brushing beyond boundaries with every stroke.`,
        }
    ],
    media: [
        {
            name: 'SOA Photography Club (SPC)',
            slug: 'spc',
            email: 'photography@soa.ac.in',
            description: 'Official media powerhouse capturing every moment with precision.',
            about: `SPC is the official media powerhouse of SOA University, capturing every moment with unmatched precision. From professional photography and event coverage to creative edits and campus storytelling — we turn memories into masterpieces.\n\nSPC is SOA's central media team, dedicated to freezing moments, framing emotions, and presenting the soul of every event. With a passionate crew of photographers, editors, and content creators, we bring the campus to life—one frame at a time.\n\nWhat We Do:\n• Professional event photography\n• Creative poster & reel editing\n• High-quality media coverage\n• Campus documentation & visual storytelling\n• Conceptual shoots and modeling projects\n\nWhy Join SPC? If you love cameras, colors, lights, edits, or simply want to explore your creative vision — SPC is your playground. Learn, create, explore, and leave your mark on SOA's visual legacy.`,
        },
        {
            name: 'Virtual Showreel (VSR)',
            slug: 'vsr',
            email: 'vsr@soa.ac.in',
            description: 'Official broadcasting & cinematography team turning stories into stunning visuals.',
            about: `Virtual Showreel is SOA's official broadcasting & cinematography team, turning stories into stunning visuals. From cinematic videos to crazy editing and creative productions — we capture beyond the limit.\n\nVirtual Showreel is the heartbeat of SOA's visual production community. Armed with cameras, rigs, lights, mics, and a creative vision, we transform ideas into cinematic masterpieces. We don't just film — we create experiences.\n\nWhat We Do:\n• Cinematography & short films\n• Event broadcasting & live coverage\n• Scripted shoots, interviews, promos\n• High-end video editing & color grading\n• Creative reels & narrative storytelling\n\nWhy Join Virtual Showreel? If you love filmmaking, direction, video editing, or production — VSR is where passion meets skill. Join a team that plays with angles, lighting setups, transitions, and film-grade creativity.`,
        }
    ],
    social: [
        {
            name: 'JAAGO',
            slug: 'jaago',
            email: 'jaago@soa.ac.in',
            description: 'Social initiative wing dedicated to uplifting communities.',
            about: `JAAGO is the social initiative wing of SOA, dedicated to uplifting communities through compassion and action. From donation drives and educational support to charitable outreach and joyful events for differently-abled children, JAAGO works to bring real change where it matters most. It's not just a club — it's a movement towards a better future.\n\nJAAGO stands as SOA's heartbeat of social service — a movement committed to spreading hope. Whether through donations, charity work, village outreach, or fun-filled activities for specially-abled children, JAAGO strives to touch lives with kindness and purpose.`,
        },
        {
            name: 'NCC SOA',
            slug: 'ncc',
            email: 'ncc@soa.ac.in',
            description: 'National Cadet Corps dedicated to discipline, social service, and leadership.',
            about: `NCC SOA is not just a club — it is a part of the prestigious National Cadet Corps, a national organization dedicated to shaping disciplined, responsible, and service-oriented citizens. Through drills, camps, social service, and leadership training, NCC SOA instills unity, courage, and a commitment to serve the nation.\n\nA proud part of the National Cadet Corps. Not a club, but a national uniformed organization dedicated to discipline, social service, leadership, and nation-building.`,
        }
    ],
    sports: [
        {
            name: 'SOA Badminton Club',
            slug: 'badminton',
            email: 'badminton@soa.ac.in',
            description: 'Dedicated space for shuttle enthusiasts.',
            about: `A dedicated space for shuttle enthusiasts, the club focuses on refining technique, improving agility, and participating in inter-college badminton tournaments.`,
        },
        {
            name: 'SOA Basketball Club',
            slug: 'basketball',
            email: 'basketball@soa.ac.in',
            description: 'Built on teamwork and fast-paced gameplay.',
            about: `Built on teamwork and fast-paced gameplay, this club trains players to master court strategies and represent SOA in major basketball leagues.`,
        },
        {
            name: 'SOA Football Club',
            slug: 'football',
            email: 'football@soa.ac.in',
            description: 'Unites passionate footballers, fostering discipline and skill.',
            about: `The club unites passionate footballers, fostering discipline and skill while competing in university and state-level matches with a strong team spirit.`,
        },
        {
            name: 'SOA Table Tennis Club',
            slug: 'table-tennis',
            email: 'tabletennis@soa.ac.in',
            description: 'Home to quick reflexes and precision play.',
            about: `Home to quick reflexes and precision play, the TT club helps students hone competitive techniques and participate in regular intra- and inter-college events.`,
        },
        {
            name: 'SOA Cricket Club',
            slug: 'cricket',
            email: 'cricket@soa.ac.in',
            description: 'Powerhouse for cricket lovers.',
            about: `A powerhouse for cricket lovers, the club nurtures batting, bowling, and fielding talent while preparing teams for major tournaments and campus leagues.`,
        }
    ]
};

const siliconClubs = {
    technical: [
        {
            name: 'Silicon Tech Club',
            slug: 'silicon-tech',
            email: 'tech@silicon.ac.in',
            description: 'Fostering technical innovation and coding skills among students.',
            about: 'The Silicon Tech Club is dedicated to promoting technical excellence through workshops, hackathons, and coding competitions. We provide a platform for students to learn new technologies and apply them in real-world projects.',
            website: 'https://silicon.ac.in/tech'
        },
        {
            name: 'Silicon Coding Society',
            slug: 'silicon-coding',
            email: 'coding@silicon.ac.in',
            description: 'A community of passionate coders solving complex problems.',
            about: 'Silicon Coding Society brings together students who love algorithms and data structures. We organize regular competitive programming contests and peer learning sessions.',
        }
    ],
    cultural: [
        {
            name: 'Silicon Beats',
            slug: 'silicon-beats',
            email: 'beats@silicon.ac.in',
            description: 'The official music and dance club of Silicon Institute.',
            about: 'Silicon Beats is where melody meets rhythm. We organize cultural nights, musical performances, and dance competitions to showcase the artistic talents of our students.',
        },
        {
            name: 'Silicon Drama',
            slug: 'silicon-drama',
            email: 'drama@silicon.ac.in',
            description: 'Expressing emotions and stories through theater and drama.',
            about: 'The Silicon Drama club is for those who love the stage. We produce plays, skits, and street plays that entertain and provoke thought.',
        }
    ],
    sports: [
        {
            name: 'Silicon Sports Club',
            slug: 'silicon-sports',
            email: 'sports@silicon.ac.in',
            description: 'Promoting physical fitness and sportsmanship.',
            about: 'The Silicon Sports Club manages all sporting activities on campus, including cricket, football, basketball, and indoor games. We believe in a healthy mind in a healthy body.',
        }
    ]
};

async function seedData() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Create SOA/ITER College
        const soaResult = await client.query(`
            INSERT INTO colleges (college_id, name, location, city, state, official_email, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (college_id) DO UPDATE SET
                name = EXCLUDED.name,
                location = EXCLUDED.location,
                updated_at = CURRENT_TIMESTAMP
            RETURNING id
        `, [
            'CLG-SOA001',
            'Siksha \'O\' Anusandhan (SOA) - Institute of Technical Education and Research (ITER)',
            'Bhubaneswar, Odisha',
            'Bhubaneswar',
            'Odisha',
            'info@soa.ac.in',
            'active'
        ]);
        const soaId = soaResult.rows[0].id;
        console.log(`✓ College created/updated: SOA/ITER (ID: ${soaId})`);

        // 2. Create Silicon Institute of Technology
        const siliconResult = await client.query(`
            INSERT INTO colleges (college_id, name, location, city, state, official_email, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (college_id) DO UPDATE SET
                name = EXCLUDED.name,
                location = EXCLUDED.location,
                updated_at = CURRENT_TIMESTAMP
            RETURNING id
        `, [
            'CLG-SIL001',
            'Silicon Institute of Technology',
            'Bhubaneswar, Odisha',
            'Bhubaneswar',
            'Odisha',
            'info@silicon.ac.in',
            'active'
        ]);
        const siliconId = siliconResult.rows[0].id;
        console.log(`✓ College created/updated: Silicon Institute (ID: ${siliconId})`);

        // Get category IDs
        const categories = await client.query('SELECT id, slug FROM categories');
        const categoryMap = {};
        categories.rows.forEach(cat => {
            categoryMap[cat.slug] = cat.id;
        });

        // Helper to insert clubs
        async function insertClubs(collegeId, clubsData) {
            for (const [categorySlug, clubs] of Object.entries(clubsData)) {
                const categoryId = categoryMap[categorySlug];
                if (!categoryId) continue;

                for (const club of clubs) {
                    const contactInfo = {
                        email: club.email,
                        socialLinks: club.website ? [{ platform: 'Website', url: club.website }] : []
                    };

                    await client.query(`
                        INSERT INTO clubs (
                            college_id, name, slug, category_id, email, 
                            description, about, contact_info, status
                        )
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                        ON CONFLICT (college_id, slug) DO UPDATE SET
                            name = EXCLUDED.name,
                            description = EXCLUDED.description,
                            about = EXCLUDED.about,
                            contact_info = EXCLUDED.contact_info,
                            updated_at = CURRENT_TIMESTAMP
                    `, [
                        collegeId,
                        club.name,
                        club.slug,
                        categoryId,
                        club.email,
                        club.description,
                        club.about,
                        JSON.stringify(contactInfo),
                        'approved'
                    ]);
                    console.log(`  ✓ ${club.name}`);
                }
            }
        }

        console.log('\nSeeding SOA Clubs...');
        await insertClubs(soaId, soaClubs);

        console.log('\nSeeding Silicon Clubs...');
        await insertClubs(siliconId, siliconClubs);

        await client.query('COMMIT');
        console.log('\n✅ Data seeding completed successfully!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Error seeding data:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

seedData();
