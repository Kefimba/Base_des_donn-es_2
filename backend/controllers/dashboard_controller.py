from __future__ import annotations

from flask import jsonify

from services.dashboard_service import DashboardService


def get_admin_dashboard():
    return jsonify(DashboardService.admin_stats()), 200
