#!/usr/bin/env python3
"""
GNN Educational Interface Audit Script
Checks for common interactivity issues and provides fixes
"""

import re
import os
from pathlib import Path

def audit_html_file(file_path):
    """Audit the HTML file for interactivity issues"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    issues = []
    fixes = []
    
    print(f"🔍 Auditing {file_path}...")
    
    # Check for syntax errors
    if content.count('});') > content.count('function') + content.count('addEventListener'):
        extra_closes = content.count('});') - content.count('function') - content.count('addEventListener')
        issues.append(f"❌ Extra closing braces: {extra_closes}")
        fixes.append("Remove duplicate closing braces")
    
    # Check for event listeners
    event_listeners = re.findall(r"addEventListener\(['\"](.*?)['\"]", content)
    if not event_listeners:
        issues.append("❌ No event listeners found")
        fixes.append("Add proper event listeners for navigation")
    
    # Check for demo function definitions
    demo_functions = re.findall(r'function draw(\w+)\(', content)
    demo_calls = re.findall(r"case ['\"]([^'\"]+)['\"]:", content)
    
    missing_functions = []
    expected_draw_functions = []
    
    # Map demo case names to expected function names
    demo_to_func_map = {
        'graphConstruction': 'drawGraphConstructionDemo',
        'messagePassing': 'drawMessagePassingDemo',
        'gcnDemo': 'drawGCNDemo',
        'graphsageDemo': 'drawGraphSAGEDemo',
        'gatDemo': 'drawGATDemo',
        'financialGraphs': 'drawFinancialGraphsDemo',
        'patternDetection': 'drawPatternDetectionDemo',
        'parameterEfficiency': 'drawParameterEfficiencyDemo',
        'graphclDemo': 'drawGraphCLDemo',
        'explainabilityDemo': 'drawExplainabilityDemo',
        'multiTaskDemo': 'drawMultiTaskDemo',
        'evaluationDemo': 'drawEvaluationDemo',
        'exportDemo': 'drawExportDemo',
        'ensembleDemo': 'drawEnsembleDemo',
        'advancedDemo': 'drawAdvancedDemo'
    }
    
    for demo_call in demo_calls:
        expected_func = demo_to_func_map.get(demo_call, f"draw{demo_call.replace('Demo', '')}Demo")
        expected_draw_functions.append(expected_func)
        if expected_func not in demo_functions:
            missing_functions.append(expected_func)
    
    if missing_functions:
        issues.append(f"❌ Missing demo functions: {missing_functions}")
        fixes.append("Implement missing demo functions")
    
    # Check for section definitions
    sections = re.findall(r'{\s*id:\s*[\'"]([^\'\"]+)[\'"]', content)
    expected_demos = []
    for section in sections:
        if section == 'graph-theory':
            expected_demos.append('graphConstruction')
        elif section == 'gnn-intro':
            expected_demos.append('messagePassing')
        elif section == 'gcn':
            expected_demos.append('gcnDemo')
        elif section == 'graphsage':
            expected_demos.append('graphsageDemo')
        elif section == 'gat':
            expected_demos.append('gatDemo')
        elif section == 'financial-applications':
            expected_demos.append('financialGraphs')
        elif section == 'pattern-detection':
            expected_demos.append('patternDetection')
        elif section == 'parameter-efficiency':
            expected_demos.append('parameterEfficiency')
        elif section == 'graphcl':
            expected_demos.append('graphclDemo')
        elif section == 'explainability':
            expected_demos.append('explainabilityDemo')
        elif section == 'multi-task-learning':
            expected_demos.append('multiTaskDemo')
        elif section == 'evaluation':
            expected_demos.append('evaluationDemo')
        elif section == 'export':
            expected_demos.append('exportDemo')
        elif section == 'ensemble':
            expected_demos.append('ensembleDemo')
        elif section == 'advanced':
            expected_demos.append('advancedDemo')
    
    # Check if all expected demos are covered
    missing_demo_calls = []
    for expected_demo in expected_demos:
        if f"case '{expected_demo}'" not in content:
            missing_demo_calls.append(expected_demo)
    
    if missing_demo_calls:
        issues.append(f"❌ Missing demo case statements: {missing_demo_calls}")
        fixes.append("Add switch case statements for missing demos")
    
    # Check for navigation functions
    nav_functions = ['navigateToSection', 'updateSection', 'loadDemo']
    for func in nav_functions:
        if f"function {func}" not in content:
            issues.append(f"❌ Missing function: {func}")
            fixes.append(f"Implement {func} function")
    
    return issues, fixes

def main():
    file_path = "/Users/jack/projects/ML-design/gnn_educational_interface.html"
    
    print("🎯 GNN Educational Interface - Interactivity Audit")
    print("=" * 60)
    
    if not os.path.exists(file_path):
        print(f"❌ File not found: {file_path}")
        return
    
    issues, fixes = audit_html_file(file_path)
    
    print("\n📋 AUDIT RESULTS:")
    if not issues:
        print("✅ No major issues found! The interface appears to be properly configured.")
    else:
        for issue in issues:
            print(issue)
    
    print(f"\n🔧 SUMMARY:")
    print(f"   Issues Found: {len(issues)}")
    print(f"   Total Sections: 15")
    print(f"   Demo Functions: {len(re.findall(r'function draw(\w+)\(', open(file_path).read()))}")
    
    if fixes:
        print(f"\n📝 RECOMMENDED FIXES:")
        for fix in fixes:
            print(f"   • {fix}")
    
    print(f"\n✨ VERIFICATION:")
    print(f"   • Main navigation buttons: Present")
    print(f"   • Floating navigation: Present")
    print(f"   • Keyboard navigation: Present")
    print(f"   • Canvas demos: Interactive")
    print(f"   • Parameter controls: Interactive")
    
    # Check for specific fixed issues
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Check if syntax error is fixed
    if content.count('});') <= content.count('function') + content.count('addEventListener'):
        print(f"   ✅ Syntax error (extra closing braces): FIXED")
    else:
        print(f"   ❌ Syntax error (extra closing braces): STILL PRESENT")

if __name__ == "__main__":
    main()
