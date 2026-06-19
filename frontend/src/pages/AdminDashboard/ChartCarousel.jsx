import Card from "../../components/common/Card";
import { ChevronLeftIcon, ChevronRightIcon } from "../../components/common/Icons";
import { BarChart } from "../../components/chart";

const ChartCarousel = ({
  chartLoading, chartSlides, realIdx, xLabels, slideCount, chartIdx, isTransitioning,
  isHovered, setIsHovered,
  goPrev, goNext, goTo, handleTransitionEnd,
}) => (
  <div
    className="col-span-1 md:col-span-2"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    <Card variant="container">
      {chartLoading || chartSlides.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-3 border-primary-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-md">
            <div className="flex items-center gap-sm">
              <button
                onClick={goPrev}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 hover:border-primary-blue/30 transition-all"
              >
                <ChevronLeftIcon />
              </button>
              <div>
                <h3 className="text-body-large-bold text-text-primary">
                  {chartSlides[realIdx].title}
                </h3>
                <p className="text-body-extra-small text-text-secondary mt-xs">
                  {chartSlides[realIdx].description}
                </p>
              </div>
              <button
                onClick={goNext}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-white/10 hover:border-primary-blue/30 transition-all"
              >
                <ChevronRightIcon />
              </button>
            </div>
            <div className="flex items-center gap-md shrink-0 ml-md">
              <div className="flex items-center gap-xs">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-blue" />
                <span className="text-body-extra-small text-text-secondary">
                  {chartSlides[realIdx].legend}
                </span>
              </div>
              <div className="flex items-center gap-xs">
                {chartSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === realIdx
                        ? "bg-primary-blue scale-125"
                        : "bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-hidden">
            <div
              className={`flex ${isTransitioning ? "transition-transform duration-500 ease-in-out" : ""}`}
              style={{ transform: `translateX(-${chartIdx * 100}%)` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {[...chartSlides, chartSlides[0]].map((slide, i) => (
                <div key={i} className="w-full shrink-0">
                  <BarChart
                    data={slide.data}
                    maxVal={slide.maxVal}
                    peakIdx={slide.peakIdx}
                    labels={xLabels}
                    yLabels={slide.yLabels}
                    yVals={slide.yVals}
                    formatValue={slide.formatValue}
                    formatStat={slide.formatStat}
                    statLabel={slide.statLabel}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Card>
  </div>
);

export default ChartCarousel;
