"""
seed-demo.py — Peuplement de la BDD AXION CAMPUS avec données de démo
Usage : python3 scripts/seed-demo.py
Prérequis : pip3 install supabase python-dotenv
"""
import os
import sys
import uuid
import random
from datetime import datetime, timedelta
from pathlib import Path

# ── Charger .env.local depuis la racine du projet ──────────────────
env_path = Path(__file__).parent.parent / '.env.local'
if not env_path.exists():
    print(f"❌ Fichier .env.local introuvable à : {env_path}")
    print("   Assure-toi de lancer le script depuis le dossier axion-campus/")
    sys.exit(1)

# Charger manuellement (évite les dépendances supplémentaires)
env_vars = {}
with open(env_path) as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#') and '=' in line:
            key, _, val = line.partition('=')
            env_vars[key.strip()] = val.strip()

SUPABASE_URL = env_vars.get('NEXT_PUBLIC_SUPABASE_URL')
SUPABASE_KEY = env_vars.get('SUPABASE_SERVICE_ROLE_KEY')

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ Variables NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquantes dans .env.local")
    sys.exit(1)

print(f"✓ URL Supabase : {SUPABASE_URL[:40]}...")

# ── Import supabase ─────────────────────────────────────────────────
try:
    from supabase import create_client
except ImportError:
    print("❌ Package 'supabase' non installé")
    print("   Lance : pip3 install supabase")
    sys.exit(1)

sb = create_client(SUPABASE_URL, SUPABASE_KEY)

# ── Récupérer ou créer l'école pilote ──────────────────────────────
print("\n📋 Recherche de l'école EFREI Paris...")
res = sb.table('ecoles').select('id, nom').eq('email', 'admin@efrei.fr').execute()

if res.data:
    ecole_id = res.data[0]['id']
    print(f"✓ École trouvée : {res.data[0]['nom']} ({ecole_id})")
else:
    print("→ École non trouvée, création...")
    res = sb.table('ecoles').insert({'nom': 'EFREI Paris', 'email': 'admin@efrei.fr'}).execute()
    ecole_id = res.data[0]['id']
    print(f"✓ École créée : {ecole_id}")

# ── Données des étudiants de démo ───────────────────────────────────
ETUDIANTS = [
    ("Alexandre Martin",  842, "A",  "Promo 2026"),
    ("Marie Lambert",     782, "B+", "Promo 2026"),
    ("Linh Nguyen",       731, "B",  "Promo 2026"),
    ("Pierre Dubois",     695, "B",  "Promo 2026"),
    ("Sara El Fassi",     640, "C",  "Promo 2026"),
    ("Lucas Bernard",     590, "C",  "Promo 2026"),
    ("Emma Rousseau",     810, "B+", "Promo 2026"),
    ("Thomas Moreau",     760, "B+", "Promo 2026"),
]

def vary(score: int, delta: int = 80) -> int:
    return max(0, min(1000, score + random.randint(-delta, delta)))

print(f"\n🌱 Insertion de {len(ETUDIANTS)} étudiants de démo...\n")

for i, (nom, score, grade, promo) in enumerate(ETUDIANTS):
    try:
        # 1. Créer la passe
        code = f"DEMO-{i+1:02d}-{str(uuid.uuid4())[:4].upper()}"
        passe_res = sb.table('passes').insert({
            'code': code,
            'ecole_id': ecole_id,
            'utilise': True
        }).execute()
        passe_id = passe_res.data[0]['id']

        # 2. Créer la session
        days_ago = random.randint(1, 14)
        finished = (datetime.utcnow() - timedelta(days=days_ago)).isoformat() + 'Z'
        session_res = sb.table('sessions').insert({
            'passe_id': passe_id,
            'ecole_id': ecole_id,
            'nom_etudiant': nom,
            'promo': promo,
            'statut': 'termine',
            'reponses': {'d1q1':'B','d1q2':'C','d2q1':'B','d2q2':'B','d3q1':'B','d3q2':'B','d4q1':'B','d4q2':'C','d5q1':'B','d5q2':'C'},
            'finished_at': finished
        }).execute()
        session_id = session_res.data[0]['id']

        # 3. Créer les résultats
        cert_uid = str(uuid.uuid4())[:8].upper()
        sb.table('resultats').insert({
            'session_id': session_id,
            'ecole_id': ecole_id,
            'score_global': score,
            'grade': grade,
            'score_d1': vary(score),
            'score_d2': vary(score),
            'score_d3': vary(score),
            'score_d4': vary(score),
            'score_d5': vary(score),
            'cert_uid': cert_uid,
            'created_at': finished
        }).execute()

        print(f"  ✓ {nom:<25} Score: {score:>4}/1000   Grade: {grade:<3}   Cert: {cert_uid}")

    except Exception as e:
        print(f"  ❌ Erreur pour {nom}: {e}")

print(f"\n✅ Seed terminé — {len(ETUDIANTS)} entrées créées")
print(f"   Dashboard admin : /admin (mot de passe dans .env.local)")
