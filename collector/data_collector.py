def collect_data(conn):
    data = {}

    data["security_groups"] = list(conn.network.security_groups())
    data["rules"] = list(conn.network.security_group_rules())
    data["servers"] = list(conn.compute.servers())
    data["floating_ips"] = list(conn.network.ips())
    data["volumes"] = list(conn.block_storage.volumes())

    return data