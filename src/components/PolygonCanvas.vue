<script setup lang="ts">
import type { Polygons } from '@/util/Polygon';
import { onMounted, useTemplateRef } from 'vue';

const props = defineProps<{ data: Polygons, extent: { width: number, height: number } }>()

const canvas = useTemplateRef('canvas')

function draw() {
  if (!canvas.value) return;

  const ctx = canvas.value!.getContext('2d')

  ctx?.clearRect(0, 0, props.extent.width, props.extent.height)

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  // Compute bounding box
  props.data!.polygons.forEach(p => {
    p.rings.forEach(r => {
      r.forEach(pos => {
        minX = Math.min(minX, pos.x)
        minY = Math.min(minY, pos.y)
        maxX = Math.max(maxX, pos.x)
        maxY = Math.max(maxY, pos.y)
      })
    })
  })

  const getBboxCenter = () => {
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2
    return { x: centerX, y: centerY }
  }

  const getBboxExtent = () => {
    const width = maxX - minX
    const height = maxY - minY
    return { width: width, height: height }
  }

  const bboxExtent = getBboxExtent()
  const bboxCenter = getBboxCenter()

  // Compute scaling factor
  let fac = Math.min(props.extent.width / bboxExtent.width, props.extent.height / bboxExtent.height)

  const viewportCenter = { x: props.extent.width / 2, y: props.extent.height / 2 }

  const scale = (pos: { x: number, y: number }) => {
    // Like in computer graphics: Translate to origin, scale, translate to target

    // Translate to origin
    pos.x -= bboxCenter.x
    pos.y -= bboxCenter.y

    // Scale
    pos.x *= fac
    pos.y *= fac

    // Translate to target
    const finalX = pos.x + viewportCenter.x
    const finalY = pos.y + viewportCenter.y

    return {
      x: finalX,
      y: finalY
    }
  }

  // Draw polygons
  ctx?.beginPath()

  props.data!.polygons.forEach(p => {
    p.rings.forEach(r => {
      r.forEach((pos, i) => {
        const scaledPos = scale(pos)
        if (i === 0) {
          ctx?.moveTo(scaledPos.x, scaledPos.y)
        } else {
          ctx?.lineTo(scaledPos.x, scaledPos.y)
        }
      })
      ctx?.closePath()
    })
  })

  ctx!.lineWidth = 2
  ctx!.strokeStyle = 'red'
  ctx?.stroke()
  console.log('stroke')
}

onMounted(() => draw())
</script>

<template>
  <canvas ref="canvas" :width="extent.width" :height="extent.height"></canvas>
</template>
