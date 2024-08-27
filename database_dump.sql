--
-- PostgreSQL database dump
--

-- Dumped from database version 13.13 (Ubuntu 13.13-1.pgdg22.04+1)
-- Dumped by pg_dump version 13.13 (Ubuntu 13.13-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: ian
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO ian;

--
-- Name: folder_playgrounds; Type: TABLE; Schema: public; Owner: ian
--

CREATE TABLE public.folder_playgrounds (
    id integer NOT NULL,
    folder_id integer NOT NULL,
    playground_id integer NOT NULL
);


ALTER TABLE public.folder_playgrounds OWNER TO ian;

--
-- Name: folder_playgrounds_id_seq; Type: SEQUENCE; Schema: public; Owner: ian
--

CREATE SEQUENCE public.folder_playgrounds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.folder_playgrounds_id_seq OWNER TO ian;

--
-- Name: folder_playgrounds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ian
--

ALTER SEQUENCE public.folder_playgrounds_id_seq OWNED BY public.folder_playgrounds.id;


--
-- Name: folders; Type: TABLE; Schema: public; Owner: ian
--

CREATE TABLE public.folders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.folders OWNER TO ian;

--
-- Name: folders_id_seq; Type: SEQUENCE; Schema: public; Owner: ian
--

CREATE SEQUENCE public.folders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.folders_id_seq OWNER TO ian;

--
-- Name: folders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ian
--

ALTER SEQUENCE public.folders_id_seq OWNED BY public.folders.id;


--
-- Name: playgrounds; Type: TABLE; Schema: public; Owner: ian
--

CREATE TABLE public.playgrounds (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    map_link text NOT NULL
);


ALTER TABLE public.playgrounds OWNER TO ian;

--
-- Name: playgrounds_id_seq; Type: SEQUENCE; Schema: public; Owner: ian
--

CREATE SEQUENCE public.playgrounds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.playgrounds_id_seq OWNER TO ian;

--
-- Name: playgrounds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ian
--

ALTER SEQUENCE public.playgrounds_id_seq OWNED BY public.playgrounds.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: ian
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public.users OWNER TO ian;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: ian
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO ian;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ian
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: folder_playgrounds id; Type: DEFAULT; Schema: public; Owner: ian
--

ALTER TABLE ONLY public.folder_playgrounds ALTER COLUMN id SET DEFAULT nextval('public.folder_playgrounds_id_seq'::regclass);


--
-- Name: folders id; Type: DEFAULT; Schema: public; Owner: ian
--

ALTER TABLE ONLY public.folders ALTER COLUMN id SET DEFAULT nextval('public.folders_id_seq'::regclass);


--
-- Name: playgrounds id; Type: DEFAULT; Schema: public; Owner: ian
--

ALTER TABLE ONLY public.playgrounds ALTER COLUMN id SET DEFAULT nextval('public.playgrounds_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: ian
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: ian
--

COPY public."SequelizeMeta" (name) FROM stdin;
20240726131304-create-user.js
\.


--
-- Data for Name: folder_playgrounds; Type: TABLE DATA; Schema: public; Owner: ian
--

COPY public.folder_playgrounds (id, folder_id, playground_id) FROM stdin;
7	7	1
11	10	1
\.


--
-- Data for Name: folders; Type: TABLE DATA; Schema: public; Owner: ian
--

COPY public.folders (id, user_id, name, created_at, updated_at) FROM stdin;
5	2		2024-08-27 12:57:02.851706	2024-08-27 12:57:02.851706
6	2	near dads house	2024-08-27 12:57:16.659496	2024-08-27 12:57:16.659496
7	3	near grandmas house	2024-08-27 13:17:15.003596	2024-08-27 13:17:15.003596
10	1	nera grandmas	2024-08-27 14:53:29.111907	2024-08-27 14:53:29.111907
\.


--
-- Data for Name: playgrounds; Type: TABLE DATA; Schema: public; Owner: ian
--

COPY public.playgrounds (id, name, latitude, longitude, map_link) FROM stdin;
1	Saxapahaw Island Park	35.9454614	-79.32139269999999	https://www.google.com/maps/search/?api=1&query=35.9454614,-79.32139269999999
2	Graham Regional Park	36.0439283	-79.34618189999999	https://www.google.com/maps/search/?api=1&query=36.0439283,-79.34618189999999
3	Cedarock Park	35.990879	-79.442281	https://www.google.com/maps/search/?api=1&query=35.990879,-79.442281
4	Wilson Park	35.9197637	-79.0755349	https://www.google.com/maps/search/?api=1&query=35.9197637,-79.0755349
5	Johns House	35.9220396	-79.3161489	https://www.google.com/maps/search/?api=1&query=35.9220396,-79.3161489
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: ian
--

COPY public.users (id, username, email, password) FROM stdin;
1	ian	ianjamespape@gmail.com	$2a$10$/U7gxILrhikI3wBBQSj8i.BPDDjekZXH95qC89bSPukvMDJ19Svh.
2	test	test@gmail.com	$2a$10$p80k8AU2i3tuMXSGZJctL.UmeIrqYlosvpfSKx.qM88b.E9m6DjKG
3	christos	christos@gmail.com	$2a$10$qE8nJOxrW3fDkADkPEPW7.PQH1ydxUCV7HCw3iGWZYmRQOKASDXZS
4	billy	billy@gmail.com	$2a$10$foSYQjMTEWKXTIWBWCDaUOVOq9uWGI2sMl0SM4NhrkEAsS80U27/u
\.


--
-- Name: folder_playgrounds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ian
--

SELECT pg_catalog.setval('public.folder_playgrounds_id_seq', 11, true);


--
-- Name: folders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ian
--

SELECT pg_catalog.setval('public.folders_id_seq', 10, true);


--
-- Name: playgrounds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ian
--

SELECT pg_catalog.setval('public.playgrounds_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ian
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: ian
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: folder_playgrounds folder_playgrounds_pkey; Type: CONSTRAINT; Schema: public; Owner: ian
--

ALTER TABLE ONLY public.folder_playgrounds
    ADD CONSTRAINT folder_playgrounds_pkey PRIMARY KEY (id);


--
-- Name: folders folders_pkey; Type: CONSTRAINT; Schema: public; Owner: ian
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT folders_pkey PRIMARY KEY (id);


--
-- Name: playgrounds playgrounds_pkey; Type: CONSTRAINT; Schema: public; Owner: ian
--

ALTER TABLE ONLY public.playgrounds
    ADD CONSTRAINT playgrounds_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: ian
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: ian
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: folder_playgrounds folder_playgrounds_folder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ian
--

ALTER TABLE ONLY public.folder_playgrounds
    ADD CONSTRAINT folder_playgrounds_folder_id_fkey FOREIGN KEY (folder_id) REFERENCES public.folders(id);


--
-- Name: folder_playgrounds folder_playgrounds_playground_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ian
--

ALTER TABLE ONLY public.folder_playgrounds
    ADD CONSTRAINT folder_playgrounds_playground_id_fkey FOREIGN KEY (playground_id) REFERENCES public.playgrounds(id);


--
-- Name: folders folders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: ian
--

ALTER TABLE ONLY public.folders
    ADD CONSTRAINT folders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

