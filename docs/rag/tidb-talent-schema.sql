CREATE TABLE IF NOT EXISTS talent_profiles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  profile_uid VARCHAR(64) NOT NULL,
  display_name VARCHAR(191),
  headline VARCHAR(255),
  narrative TEXT NOT NULL,
  search_text TEXT NOT NULL,
  structured JSON,
  embedding VECTOR(1536),
  embedding_model VARCHAR(128),
  embedding_dimensions INT,
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_talent_profiles_profile_uid (profile_uid),
  KEY idx_talent_profiles_status_updated (status, updated_at),
  KEY idx_talent_profiles_display_name (display_name)
);

CREATE TABLE IF NOT EXISTS talent_profile_facts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  fact_uid VARCHAR(64) NOT NULL,
  profile_uid VARCHAR(64) NOT NULL,
  fact_type VARCHAR(64) NOT NULL,
  label VARCHAR(191) NOT NULL,
  value_text TEXT,
  numeric_value DECIMAL(8,2),
  evidence_text TEXT,
  confidence DECIMAL(4,3),
  verified_by_user TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uk_talent_profile_facts_fact_uid (fact_uid),
  KEY idx_talent_profile_facts_profile_uid (profile_uid),
  KEY idx_talent_profile_facts_type_label (fact_type, label)
);
