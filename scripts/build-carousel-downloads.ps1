param(
    [int]$StartLook = 1,
    [int]$EndLook = 10
)

$ErrorActionPreference = 'Stop'
$workspacePath = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$downloadRoot = Join-Path $workspacePath 'content\campaigns\atelier-23\setembro-2026\downloads'
$tempPath = Join-Path $workspacePath ('.tmp-carousel-downloads-' + [guid]::NewGuid().ToString('N'))
$resolvedTemp = [IO.Path]::GetFullPath($tempPath)

if (-not $resolvedTemp.StartsWith($workspacePath + [IO.Path]::DirectorySeparatorChar)) {
    throw 'Caminho temporario fora do workspace.'
}

New-Item -ItemType Directory -Force -Path $downloadRoot | Out-Null
New-Item -ItemType Directory -Path $resolvedTemp | Out-Null

try {
    $manifestJson = node -e "import('./content/campaigns/atelier-23/setembro-2026/campaign.js').then(({campaign}) => console.log(JSON.stringify(campaign.looks.map((look) => ({ id: look.id, images: look.images.map((image) => image.src.split('?')[0]) })))))"
    $manifest = $manifestJson | ConvertFrom-Json

    foreach ($look in ($manifest | Where-Object { $_.id -ge $StartLook -and $_.id -le $EndLook })) {
        $lookName = 'look-' + ([int]$look.id).ToString('00')
        $lookFolder = Join-Path $resolvedTemp $lookName
        New-Item -ItemType Directory -Path $lookFolder | Out-Null

        for ($index = 0; $index -lt $look.images.Count; $index++) {
            $fileName = 'atelier-23-' + $lookName + '-' + ($index + 1).ToString('00') + '.jpg'
            $sourceUrl = $look.images[$index] + '?auto=compress&cs=tinysrgb&w=1080&h=1350&fit=crop'
            Invoke-WebRequest -UseBasicParsing -Uri $sourceUrl -OutFile (Join-Path $lookFolder $fileName) -TimeoutSec 60
        }

        $zipName = 'atelier-23-setembro-2026-' + $lookName + '.zip'
        $zipPath = Join-Path $downloadRoot $zipName
        Compress-Archive -Path (Join-Path $lookFolder '*.jpg') -DestinationPath $zipPath -CompressionLevel Optimal -Force
        $zip = Get-Item -LiteralPath $zipPath
        Write-Output "$zipName`t$($look.images.Count) imagens`t$([math]::Round($zip.Length / 1MB, 2)) MB"
    }
}
finally {
    if (Test-Path -LiteralPath $resolvedTemp) {
        Remove-Item -LiteralPath $resolvedTemp -Recurse -Force
    }
}
