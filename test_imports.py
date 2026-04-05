from config import get_connection
from collector.data_collector import collect_data
from rules.network_rules import check_network_rules
from rules.storage_rules import check_storage_rules
from rules.ip_rules import check_ip_rules
from scoring.risk_scorer import calculate_score
from reporting.report_generator import generate_report

print("All imports are OK")