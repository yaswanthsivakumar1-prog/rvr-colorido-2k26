-- ============================================
-- RVR COLORIDO 2K26 — Seed Data
-- ============================================
-- Run this SQL in your Supabase SQL Editor AFTER running schema.sql
-- All data here is realistic sample/dummy data for demonstration purposes.

-- ============================================
-- 1. CULTURAL EVENTS
-- ============================================

INSERT INTO events (name, slug, category, subcategory, gender, description, rules, venue, event_date, start_time, end_time, max_participants, registration_open, image_url)
VALUES
(
  'Fine Arts - Canvas Painting & Sketching',
  'fine-arts-canvas-painting',
  'cultural',
  'Fine Arts',
  'open',
  'Unleash your imagination on canvas! Participants will be provided an on-the-spot theme and must complete their masterpiece within the stipulated timeframe using their chosen medium (watercolors, acrylics, charcoal, or pencil sketch).',
  '["Theme will be announced 15 minutes before the competition starts.", "Time duration is 2.5 hours strictly.", "Basic drawing sheets will be provided; participants must bring their own paints, brushes, and sketching materials.", "Use of digital devices or reference material during the event is strictly prohibited.", "Judging will be based on creativity, composition, color harmony, and relevance to the theme."]'::jsonb,
  'Drawing Hall, Silver Jubilee Block',
  '2026-03-12',
  '09:30 AM',
  '12:00 PM',
  50,
  true,
  'https://images.unsplash.com/photo-1460661419200-993d0cbbfe02?auto=format&fit=crop&w=800&q=80'
),
(
  'Solo Singing (Classical & Light Music)',
  'solo-singing-classical-light',
  'cultural',
  'Music Solo',
  'open',
  'Showcase your vocal brilliance in our premier solo singing contest. Open to Indian Classical, Carnatic, Hindustani, Semi-Classical, and Light/Film Vocal genres.',
  '["Time limit: 4 to 5 minutes including sound check.", "Karaoke tracks must be submitted on a pen drive in MP3 format 1 hour prior to the event.", "Live accompaniment is limited to a maximum of 2 instrumentalists (keyboard/shruti box/tabla).", "Explicit language or inappropriate lyrics are strictly forbidden.", "Judgment criteria: pitch precision (shruti), rhythm (laya), voice modulation, and stage presence."]'::jsonb,
  'Open Air Theatre (OAT)',
  '2026-03-12',
  '10:00 AM',
  '01:00 PM',
  40,
  true,
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80'
),
(
  'Western & Fusion Solo Vocals',
  'western-solo-vocals',
  'cultural',
  'Music Solo',
  'open',
  'Belt out your favorite rock, pop, jazz, or acoustic acoustic numbers in this high-energy western vocal competition.',
  '["Time limit: 4 minutes.", "Acoustic guitar backing allowed, or backing track via AUX/Bluetooth.", "No pre-recorded vocal harmonies in the backing track.", "Original compositions will receive bonus points."]'::jsonb,
  'Mechanical Seminar Hall',
  '2026-03-12',
  '02:00 PM',
  '04:30 PM',
  30,
  true,
  'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
),
(
  'Battle of the Bands (Group Music)',
  'battle-of-the-bands',
  'cultural',
  'Music Group',
  'open',
  'The ultimate showdown of college rock, fusion, and metal bands! Bring your guitars, drums, synths, and pure adrenaline to rock the COLORIDO stage.',
  '["Team size: 3 to 8 members.", "Stage setup time: 5 minutes. Performance time: 12 minutes strictly.", "Standard 5-piece drum kit and sound system provided. Bands must bring their own guitars, keyboards, pedals, and drumsticks.", "Pre-recorded tracks or sequencers are not permitted.", "Evaluation on original arrangement, tight sync, instrumental prowess, and crowd engagement."]'::jsonb,
  'Main College Auditorium',
  '2026-03-13',
  '04:00 PM',
  '08:00 PM',
  16,
  true,
  'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80'
),
(
  'Solo Dance Championship',
  'solo-dance-championship',
  'cultural',
  'Dance Solo',
  'open',
  'A high-voltage solo dance contest spanning Classical, Contemporary, Hip-Hop, Popping, and Freestyle. Own the spotlight with your signature choreography.',
  '["Performance duration: 3 to 4 minutes.", "Track must be submitted in MP3 format 1 hour before the category starts.", "Props are permitted but must be declared beforehand. No fire, water, or hazardous items.", "Costume and vulgarity guidelines apply strictly.", "Evaluation based on choreography, expression, technique, rhythm, and costume."]'::jsonb,
  'Open Air Theatre (OAT)',
  '2026-03-12',
  '02:00 PM',
  '05:30 PM',
  40,
  true,
  'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=800&q=80'
),
(
  'Group Dance Showdown',
  'group-dance-showdown',
  'cultural',
  'Dance Group',
  'open',
  'Synchronized beats, acrobatic stunts, and mesmerizing team dynamics. Battle it out for the title of Best Dance Troupe at COLORIDO 2K26.',
  '["Team size: 6 to 18 dancers.", "Performance duration: 6 to 8 minutes.", "Open theme / style (Bollywood, Folk, Hip-Hop, Urban, Contemporary).", "Points awarded for synchronization, transitions, innovation, and costume."]'::jsonb,
  'Main College Auditorium',
  '2026-03-13',
  '10:00 AM',
  '02:00 PM',
  20,
  true,
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80'
),
(
  'Choreoday — Mega Thematic Dance Production',
  'choreoday-mega-dance-production',
  'cultural',
  'Choreoday',
  'open',
  'The flagship cultural spectacle of COLORIDO 2K26! Large-scale departmental and inter-college dance-drama production combining narrative storytelling, stunning light effects, and theatrical power.',
  '["Team size: 15 to 35 members.", "Time limit: 12 to 15 minutes (curtain to curtain).", "Clear social, historical, mythological, or conceptual narrative storyline required.", "Synopsis script must be handed to judges prior to the show.", "Full stage lighting and smoke effects will be supported."]'::jsonb,
  'Main College Stadium Stage',
  '2026-03-13',
  '06:00 PM',
  '10:00 PM',
  12,
  true,
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80'
),
(
  'Dramatics — Skit & Mime Challenge',
  'dramatics-skit-and-mime',
  'cultural',
  'Dramatics',
  'open',
  'Evoke tears, laughter, and introspection with the power of acting. Showcase social satire, comedy, or thought-provoking silent mime.',
  '["Team size: 4 to 10 participants.", "Time limit: 8 to 10 minutes.", "For Mime: No speech or lip sync; only background music and mime makeup permitted.", "For Skit: Languages allowed are English, Telugu, and Hindi.", "No defamatory, political, or offensive content."]'::jsonb,
  'ECE Seminar Hall',
  '2026-03-12',
  '11:00 AM',
  '02:00 PM',
  15,
  true,
  'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80'
),
(
  'Couture Clash — Fashion Show',
  'couture-clash-fashion-show',
  'cultural',
  'Fashion Show',
  'open',
  'Elegance, poise, and runway flair! Bring forward your college fashion society and present theme-based designer couture spanning Indian royalty to futuristic cyberpunk.',
  '["Team size: 10 to 18 models plus designers/crew.", "Ramp time: 8 to 10 minutes including intro narrative.", "Theme must be conveyed through costumes, music, and choreography.", "Decency in attire is mandatory as per college guidelines.", "Judging criteria: Theme adherence, poise, ramp walk, costume design, and coordination."]'::jsonb,
  'Main College Auditorium',
  '2026-03-14',
  '05:00 PM',
  '08:30 PM',
  10,
  true,
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
),
(
  'Tekraft — Creative Design & Innovation',
  'tekraft-creative-design',
  'cultural',
  'Tekraft',
  'open',
  'Where engineering meets aesthetic craft. Craft models from scrap materials, creative product redesigns, origami architecture, and sustainable art installations.',
  '["Team size: 2 to 3 members.", "Duration: 2 hours.", "Primary materials: waste materials, eco-friendly cardboards, wires, and recycled items provided on-site.", "Judging based on novelty, functional design, craftsmanship, and presentation."]'::jsonb,
  'Civil Engineering Modeling Lab',
  '2026-03-12',
  '02:00 PM',
  '04:30 PM',
  25,
  true,
  'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
),
(
  'National Youth Parliamentary Debate',
  'national-youth-parliamentary-debate',
  'cultural',
  'Literary',
  'open',
  'A battle of sharp minds, articulate arguments, and parliamentary decorum on modern socio-economic and technological issues.',
  '["Format: Modified Asian Parliamentary Debate (3 vs 3).", "Motion announced 20 minutes prior to match.", "Preparation without internet assistance.", "Points for logic, counter-rebuttal, rhetoric, and parliamentary discipline."]'::jsonb,
  'Central Library Conference Hall',
  '2026-03-12',
  '10:30 AM',
  '01:30 PM',
  24,
  true,
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80'
),
(
  'General & Pop Culture Quiz (Brainiacs 2K26)',
  'general-pop-culture-quiz',
  'cultural',
  'Literary',
  'open',
  'The quintessential college trivia quiz featuring audio-visual rounds, sports, cinema, technology, history, and lateral thinking.',
  '["Team of 2 members.", "Preliminary written round of 30 questions to shortlist top 6 teams for the grand stage finals.", "Negative marking applies in buzzer rounds.", "Quizmaster decisions are final."]'::jsonb,
  'Hi-Tech Seminar Hall',
  '2026-03-13',
  '09:30 AM',
  '12:30 PM',
  60,
  true,
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 2. SPORTS EVENTS (BOYS & GIRLS)
-- ============================================

INSERT INTO events (name, slug, category, subcategory, gender, description, rules, venue, event_date, start_time, end_time, max_participants, registration_open, image_url)
VALUES
(
  'Basketball Championship — Men',
  'basketball-championship-men',
  'sports',
  'Basketball',
  'boys',
  'Full-court 5v5 collegiate basketball tournament following official FIBA rules. Knockout bracket format culminating in the high-stakes trophy match.',
  '["FIBA standard rules apply.", "Squad size: 5 playing + up to 5 rolling substitutes (Max 10 players).", "Match format: 4 quarters of 10 minutes running time; stop-clock in the final 2 minutes of Q4.", "Teams must report in uniform college jerseys with visible numbers.", "Referees decisions are final and binding."]'::jsonb,
  'College Floodlit Basketball Courts',
  '2026-03-12',
  '08:00 AM',
  '06:00 PM',
  16,
  true,
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80'
),
(
  'Basketball Championship — Women',
  'basketball-championship-women',
  'sports',
  'Basketball',
  'girls',
  'Inter-collegiate women basketball showdown. Fast breaks, tactical defense, and high-intensity competition.',
  '["FIBA rules apply.", "Squad size: 5 playing + up to 5 substitutes.", "4 quarters of 8 minutes each.", "Teams must wear identical jerseys with distinct numbers."]'::jsonb,
  'College Floodlit Basketball Courts',
  '2026-03-13',
  '08:00 AM',
  '04:00 PM',
  12,
  true,
  'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80'
),
(
  'Volleyball Tournament — Men',
  'volleyball-tournament-men',
  'sports',
  'Volleyball',
  'boys',
  'Thunderous spikes and desperate digs on our outdoor volleyball courts. Teams battle across a knockout bracket.',
  '["Matches are best of 3 sets of 25 points (3rd set 15 points if required).", "Team composition: 6 playing + 6 substitutes (including 1 designated Libero).", "Rotational rules strictly enforced.", "Netted antennae rules as per FIVB standards."]'::jsonb,
  'Outdoor Volleyball Courts 1 & 2',
  '2026-03-12',
  '08:30 AM',
  '05:30 PM',
  24,
  true,
  'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80'
),
(
  'Volleyball Tournament — Women',
  'volleyball-tournament-women',
  'sports',
  'Volleyball',
  'girls',
  'Competitive volleyball championship for women. Power serves, tactical blocks, and fierce collegiate teamwork.',
  '["Best of 3 sets of 25 points.", "Squad size: 6 playing + up to 4 substitutes.", "Standard net height and FIVB regulations apply.", "Proper sports shoes and kits required."]'::jsonb,
  'Outdoor Volleyball Court 3',
  '2026-03-13',
  '09:00 AM',
  '04:30 PM',
  16,
  true,
  'https://images.unsplash.com/photo-1592656094267-764a45160876?auto=format&fit=crop&w=800&q=80'
),
(
  'Table Tennis Singles & Doubles — Men',
  'table-tennis-men',
  'sports',
  'Table Tennis',
  'boys',
  'Lightning-fast spins and lightning reflexes on international Stag tables. Singles and Doubles categories.',
  '["ITTF standard rules apply.", "Best of 5 games of 11 points each.", "Participants must bring their own certified ITTF rubber rackets; balls (Stag 3-star 40+ mm) will be provided.", "Non-marking court shoes compulsory."]'::jsonb,
  'Indoor Sports Complex (Table 1-4)',
  '2026-03-12',
  '10:00 AM',
  '05:00 PM',
  32,
  true,
  'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=800&q=80'
),
(
  'Table Tennis Singles & Doubles — Women',
  'table-tennis-women',
  'sports',
  'Table Tennis',
  'girls',
  'Precision and agility table tennis championship for women collegiate players.',
  '["ITTF regulations apply.", "Best of 5 games of 11 points.", "Singles and Doubles formats.", "ITTF approved rubber paddles only."]'::jsonb,
  'Indoor Sports Complex (Table 5-8)',
  '2026-03-13',
  '10:00 AM',
  '04:00 PM',
  24,
  true,
  'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=800&q=80'
),
(
  'Throwball Championship — Women',
  'throwball-championship-women',
  'sports',
  'Throwball',
  'girls',
  'The premier women throwball invitational. High-flying throws, tight defense, and team strategies.',
  '["Team size: 7 playing + up to 5 substitutes.", "Match is best of 3 sets of 25 points.", "Service ball must cross the net without touching; double hand catch / throw is a fault.", "Catching time: Maximum 3 seconds holding time allowed."]'::jsonb,
  'Throwball Grounds',
  '2026-03-12',
  '08:30 AM',
  '03:30 PM',
  16,
  true,
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'
),
(
  'TenniKoit Tournament — Women',
  'tennikoit-tournament-women',
  'sports',
  'TenniKoit',
  'girls',
  'Fast-paced ring-catching sport testing reflexes, stamina, and strategic placement. Singles and doubles brackets.',
  '["Standard TenniKoit Federation of India rules.", "Best of 3 sets of 21 points.", "Catch and throw must be in a single continuous movement with one hand.", "No shaking or wobbling of ring during release."]'::jsonb,
  'TenniKoit Clay Courts',
  '2026-03-13',
  '09:00 AM',
  '03:00 PM',
  20,
  true,
  'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80'
),
(
  'Badminton Championship — Men (Singles & Doubles)',
  'badminton-championship-men',
  'sports',
  'Badminton',
  'boys',
  'Smash down your opponents on wooden indoor courts with Yonex feather shuttles.',
  '["BWF scoring: Best of 3 sets of 21 points (rally points).", "Yonex AS-2 feather shuttles provided.", "Non-marking gum sole shoes mandatory inside the wooden arena.", "Players must bring their own rackets."]'::jsonb,
  'Indoor Badminton Stadium',
  '2026-03-12',
  '09:00 AM',
  '06:00 PM',
  32,
  true,
  'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'
),
(
  'Badminton Championship — Women (Singles & Doubles)',
  'badminton-championship-women',
  'sports',
  'Badminton',
  'girls',
  'Graceful footwork meets clinical smashes in the women badminton championship.',
  '["BWF scoring format: 21 points, best of 3 sets.", "Non-marking badminton court shoes compulsory.", "Yonex feather shuttles provided."]'::jsonb,
  'Indoor Badminton Stadium',
  '2026-03-13',
  '09:00 AM',
  '05:00 PM',
  24,
  true,
  'https://images.unsplash.com/photo-1613918108466-292b78a8ef95?auto=format&fit=crop&w=800&q=80'
)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- 3. ANNOUNCEMENTS
-- ============================================

INSERT INTO announcements (title, description, priority, published, created_at)
VALUES
(
  'Registrations are Officially Open for COLORIDO 2K26!',
  'We are thrilled to open registrations for RVR COLORIDO 2K26 — National Cultural & Sports Fest. Register your teams before March 5, 2026 to guarantee your slot.',
  'urgent',
  true,
  now() - interval '2 days'
),
(
  'Total Cash Prize Pool Exceeds ₹5,00,000!',
  'Exciting prizes, trophies, and merit certificates await winners across all cultural and sports events. Individual certificates of participation will be provided to all registered participants.',
  'high',
  true,
  now() - interval '1 day'
),
(
  'Mandatory ID Card & College Bonafide Instructions',
  'All participants must carry their original college identity card along with a stamped bonafide/permission letter signed by their respective Principal/Dean for entry into the campus.',
  'high',
  true,
  now() - interval '12 hours'
),
(
  'Free Accommodation for Outstation Contingents',
  'Hostel accommodation with meals will be provided for contingents travelling from outside Guntur/Vijayawada. Please indicate hostel requirement in the additional info field during registration.',
  'medium',
  true,
  now() - interval '6 hours'
),
(
  'DJ Night & Celebrity Performance Announced for Day 3',
  'The grand finale on March 14, 2026 will feature top-billed EDM artists and surprise celebrity guest appearances at the Main Stadium.',
  'medium',
  true,
  now() - interval '2 hours'
);

-- ============================================
-- 4. SPONSORS
-- ============================================

INSERT INTO sponsors (name, logo_url, website, sponsorship_level)
VALUES
(
  'TechVanguard Solutions',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
  'https://example.com/techvanguard',
  'title'
),
(
  'State Bank of India',
  'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=200&q=80',
  'https://sbi.co.in',
  'gold'
),
(
  'Decathlon Sports India',
  'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=200&q=80',
  'https://decathlon.in',
  'gold'
),
(
  'Red Bull India',
  'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=200&q=80',
  'https://redbull.com',
  'silver'
),
(
  'Monster Energy Drinks',
  'https://images.unsplash.com/photo-1527960656366-ee73f2b62738?auto=format&fit=crop&w=200&q=80',
  'https://monsterenergy.com',
  'silver'
),
(
  'Domino''s Pizza Guntur',
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=200&q=80',
  'https://dominos.co.in',
  'supporting'
),
(
  'Greenleaf Beverages',
  'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80',
  'https://example.com/greenleaf',
  'supporting'
);

-- ============================================
-- 5. GALLERY (Sample Photos)
-- ============================================

INSERT INTO gallery (title, image_url, category, description)
VALUES
(
  'Electrifying Battle of the Bands',
  'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
  'cultural',
  'College bands setting the stage on fire with rock riffs'
),
(
  'Classical Fusion Dance Performance',
  'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
  'cultural',
  'Mesmerizing group choreography at OAT'
),
(
  'Championship Basketball Finals',
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
  'sports',
  'Intense clutch buzzer-beater basket'
),
(
  'Volleyball Match Point Spike',
  'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
  'sports',
  'Spiker leaping high over the double block'
),
(
  'Runway Fashion Show Winners',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
  'cultural',
  'Vibrant ethnic couture presentation'
),
(
  'Canvas Painting Live Competition',
  'https://images.unsplash.com/photo-1460661419200-993d0cbbfe02?auto=format&fit=crop&w=1200&q=80',
  'cultural',
  'Art students painting live on campus'
);

-- ============================================
-- 6. SAMPLE RESULTS (For Demonstration)
-- ============================================

DO $$
DECLARE
  v_music_id UUID;
  v_basket_id UUID;
BEGIN
  SELECT id INTO v_music_id FROM events WHERE slug = 'solo-singing-classical-light' LIMIT 1;
  SELECT id INTO v_basket_id FROM events WHERE slug = 'basketball-championship-men' LIMIT 1;

  IF v_music_id IS NOT NULL THEN
    INSERT INTO results (event_id, position, participant_name, college, score, remarks, published)
    VALUES
    (v_music_id, 1, 'Priya K. Sharma', 'KL University', '96.5 / 100', 'Flawless shruti and ragam rendition', true),
    (v_music_id, 2, 'Rohan Verma', 'VR Siddhartha Engg College', '93.0 / 100', 'Excellent classical voice control', true),
    (v_music_id, 3, 'Ananya Reddy', 'RVR & JC College of Engineering', '90.5 / 100', 'Soulful light music performance', true);
  END IF;

  IF v_basket_id IS NOT NULL THEN
    INSERT INTO results (event_id, position, participant_name, team_name, college, score, remarks, published)
    VALUES
    (v_basket_id, 1, 'Kiran Kumar (Captain)', 'RVR Titans', 'RVR & JC College of Engineering', '68 - 62', 'Won thrilling overtime final', true),
    (v_basket_id, 2, 'Aditya Rao (Captain)', 'Vignan Hawks', 'Vignan University', '62 - 68', 'Runner Up with fierce defense', true);
  END IF;
END $$;
