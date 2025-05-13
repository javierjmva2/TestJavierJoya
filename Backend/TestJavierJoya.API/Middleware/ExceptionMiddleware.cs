using System.Net;
using System.Text;
using System.Text.Json;

namespace TestJavierJoya.API.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var request = await FormatRequest(context.Request);

            try
            {
                var originalBodyStream = context.Response.Body;
                using var responseBody = new MemoryStream();
                context.Response.Body = responseBody;

                await _next(context);

                var response = await FormatResponse(context.Response);
                _logger.LogInformation("OK -> HTTP {Method} {Path} | Status: {StatusCode}\nRequest: {Request}\nResponse: {Response}",
                    context.Request.Method,
                    context.Request.Path,
                    context.Response.StatusCode,
                    request,
                    response);

                await responseBody.CopyToAsync(originalBodyStream);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ERROR -> HTTP {Method} {Path} failed\nRequest: {Request}",
                    context.Request.Method,
                    context.Request.Path,
                    request);

                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";
            }
        }

        private async Task<string> FormatRequest(HttpRequest request)
        {
            request.EnableBuffering();

            if (request.ContentLength == null || request.ContentLength == 0)
                return "{}";

            request.Body.Position = 0;
            using var reader = new StreamReader(request.Body, Encoding.UTF8, leaveOpen: true);
            var body = await reader.ReadToEndAsync();
            request.Body.Position = 0;

            return body;
        }

        private async Task<string> FormatResponse(HttpResponse response)
        {
            if (!response.Body.CanRead)
                return string.Empty;
            response.Body.Seek(0, SeekOrigin.Begin);
            var text = await new StreamReader(response.Body).ReadToEndAsync();
            response.Body.Seek(0, SeekOrigin.Begin);

            return text;
        }
    }
}
