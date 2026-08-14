# ============================================================
# auto-github-sync.ps1
# Script de sincronização automática com o GitHub
# ============================================================

# Caminho do repositório
$repoPath = "C:\Users\jhonnathan.pereira\OneDrive - JACOBS DOUWE EGBERTS (JDE) (1)\GitHub-SHECard\treinamentos-colaboradores"

# Caminho completo do Git (encontrado no seu sistema)
$gitPath = "C:\Users\jhonnathan.pereira\AppData\Local\Programs\Git\cmd\git.exe"

# Entrar na pasta
cd $repoPath

# Puxar mudanças do GitHub
& $gitPath pull origin main

# Verificar mudanças locais
$status = & $gitPath status --porcelain

if ($status) {
    & $gitPath add .
    $data = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    & $gitPath commit -m "Auto-sync - $data"
    & $gitPath push origin main
    "$data - Sync realizado com sucesso!" >> "$repoPath\sync-log.txt"
    Write-Host "Sync realizado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Nenhuma mudança detectada." -ForegroundColor Yellow
}

# Mantém a janela aberta para você ler o resultado
Write-Host ""
Write-Host "Pressione qualquer tecla para fechar esta janela..." -ForegroundColor Cyan
Read-Host