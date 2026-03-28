import { useState, useEffect } from 'react'

export interface WeatherData {
  temperature: number
  humidity: number
  windSpeed: number
  condition: string
  conditionCode: number
  uvIndex: number
  precipitation: number
}

export interface AgriculturalInsight {
  title: string
  description: string
  type: 'warning' | 'info' | 'success' | 'alert'
  icon: string
  recommendation: string
}

export function useAgriculturalWeather(latitude: number = -23.5505, longitude: number = -46.6333) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [insights, setInsights] = useState<AgriculturalInsight[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Busca dados atuais e de previsão da Open-Meteo API (gratuita)
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=uv_index_max,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=America%2FSao_Paulo&forecast_days=7`
        )

        if (!response.ok) {
          throw new Error('Erro ao buscar dados climáticos')
        }

        const data = await response.json()

        const currentWeather: WeatherData = {
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          condition: getWeatherCondition(data.current.weather_code),
          conditionCode: data.current.weather_code,
          uvIndex: data.daily.uv_index_max[0],
          precipitation: data.current.precipitation || 0
        }

        setWeather(currentWeather)

        // Gerar insights baseados nos dados
        const generatedInsights = generateAgriculturalInsights(currentWeather, data.daily)
        setInsights(generatedInsights)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeatherData()
  }, [latitude, longitude])

  return { weather, insights, isLoading, error }
}

function getWeatherCondition(code: number): string {
  const conditions: Record<number, string> = {
    0: 'Céu limpo',
    1: 'Principalmente limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Nevoeiro',
    48: 'Nevoeiro com geada',
    51: 'Garoa leve',
    53: 'Garoa moderada',
    55: 'Garoa densa',
    61: 'Chuva fraca',
    63: 'Chuva moderada',
    65: 'Chuva forte',
    71: 'Neve fraca',
    73: 'Neve moderada',
    75: 'Neve forte',
    80: 'Chuva leve',
    81: 'Chuva moderada',
    82: 'Chuva torrencial',
    95: 'Tempestade',
    96: 'Tempestade com granizo',
    99: 'Tempestade forte com granizo'
  }
  return conditions[code] || 'Condição desconhecida'
}

function generateAgriculturalInsights(
  current: WeatherData,
  daily: any
): AgriculturalInsight[] {
  const insights: AgriculturalInsight[] = []

  // Insight de temperatura
  if (current.temperature > 30) {
    insights.push({
      title: 'Atenção ao calor excessivo',
      description: `Temperatura atual de ${current.temperature}°C pode causar estresse nas plantas`,
      type: 'warning',
      icon: 'sun',
      recommendation: 'Considere aumentar a irrigação e monitorar sinais de estresse térmico'
    })
  } else if (current.temperature < 15) {
    insights.push({
      title: 'Temperatura baixa detectada',
      description: `Temperatura de ${current.temperature}°C pode retardar o crescimento`,
      type: 'info',
      icon: 'thermometer',
      recommendation: 'Monitore culturas sensíveis e proteja contra geadas se necessário'
    })
  } else {
    insights.push({
      title: 'Temperatura ideal',
      description: `Temperatura de ${current.temperature}°C é favorável para o crescimento`,
      type: 'success',
      icon: 'check',
      recommendation: 'Condições ótimas para desenvolvimento das culturas'
    })
  }

  // Insight de umidade
  if (current.humidity > 80) {
    insights.push({
      title: 'Umidade elevada',
      description: `Umidade de ${current.humidity}% favorece doenças fúngicas`,
      type: 'alert',
      icon: 'droplet',
      recommendation: 'Redobre atenção a pragas e doenças. Considere tratamento preventivo'
    })
  } else if (current.humidity < 40) {
    insights.push({
      title: 'Umidade baixa',
      description: `Umidade de ${current.humidity}% pode causar estresse hídrico`,
      type: 'warning',
      icon: 'droplet',
      recommendation: 'Aumente a frequência de irrigação e monitore o solo'
    })
  }

  // Insight de chuva
  if (current.precipitation > 5) {
    insights.push({
      title: 'Precipitação em andamento',
      description: `Chuva atual de ${current.precipitation}mm`,
      type: 'info',
      icon: 'cloud-rain',
      recommendation: 'Aproveite para reduzir irrigação artificial'
    })
  }

  // Previsão de chuva nos próximos dias
  const rainForecast = daily.precipitation_sum?.slice(1, 4).reduce((a: number, b: number) => a + b, 0) || 0
  if (rainForecast > 20) {
    insights.push({
      title: 'Chuva prevista',
      description: `Previsão de ${rainForecast}mm para os próximos 3 dias`,
      type: 'success',
      icon: 'cloud',
      recommendation: 'Planeje atividades de campo e reduza irrigação programada'
    })
  }

  // Insight de UV
  if (current.uvIndex >= 8) {
    insights.push({
      title: 'UV extremo',
      description: `Índice UV ${current.uvIndex} - Proteção necessária`,
      type: 'warning',
      icon: 'sun',
      recommendation: 'Proteja trabalhadores rurais e monitore estresse nas plantas'
    })
  } else if (current.uvIndex >= 6) {
    insights.push({
      title: 'UV alto',
      description: `Índice UV ${current.uvIndex} - Atenção necessária`,
      type: 'info',
      icon: 'sun',
      recommendation: 'Use proteção solar e evite exposição prolongada'
    })
  }

  // Insight de vento
  if (current.windSpeed > 30) {
    insights.push({
      title: 'Ventos fortes',
      description: `Vento de ${current.windSpeed} km/h pode danificar culturas`,
      type: 'alert',
      icon: 'wind',
      recommendation: 'Verifique suportes e proteja plantas mais sensíveis'
    })
  }

  // Se não houver alertas, mostra insight positivo
  if (insights.length === 0) {
    insights.push({
      title: 'Condições favoráveis',
      description: 'Condições climáticas atuais são favoráveis para a agricultura',
      type: 'success',
      icon: 'check',
      recommendation: 'Momento ideal para atividades de campo e tratos culturais'
    })
  }

  return insights
}
